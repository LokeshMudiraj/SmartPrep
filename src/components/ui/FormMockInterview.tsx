import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { Interview } from "@/types";
import CustomBreadCrumb from "./CustomBreadCrumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import Headings from "./Headings";
import { Button } from "./button";
import { Loader } from "lucide-react";
import { Separator } from "./separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { chatSession } from "@/scripts";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, } from "firebase/firestore";
import { db } from "@/config/firebase.config";

// Type Definitions

type FormMockInterviewProps = {
    initialData: Interview | null;
};

const formSchema = z.object({
    position: z.string().min(1, "Position is required").max(100, "Position must be 100 characters or less"),
    description: z.string().min(10, "Description is required"),
    experience: z.any().refine((val) => !isNaN(Number(val)), {
        message: "Experience must be a number",
    }).transform((val) => Number(val)),
    techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                position: initialData.position,
                description: initialData.description,
                experience: Number(initialData.experience),
                techStack: initialData.techStack,
            }
            : {
                position: "",
                description: "",
                experience: 0,
                techStack: "",
            },
    });

    const { isValid, isSubmitting } = form.formState;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { userId } = useAuth();

    const title = initialData?.position || "Create a new Mock Interview";
    const breadCrumbPage = initialData ? "Edit" : "Create";
    const actions = initialData ? "Save Changes" : "Create";
    const toastMessage = initialData
        ? { title: "Updating...!", description: "Changes saved successfully..." }
        : { title: "Created...!", description: "New Mock Interview created..." };

    const cleanAiResponse = (responseText: string) => {
        try {
            let cleanText = responseText.trim();

            // Remove code block formatting
            cleanText = cleanText.replace(/```json|```|`/g, "");

            // Extract JSON array
            const jsonArrayMatch = cleanText.match(/\[.*\]/s);
            if (!jsonArrayMatch) {
                throw new Error("No JSON array found in response");
            }

            cleanText = jsonArrayMatch[0];
            cleanText = cleanText.replace(/[\b\f\r]/g, ""); // sanitize

            const parsed = JSON.parse(cleanText);

            // 🔁 Rename `questions` to `question`
            const normalized = parsed.map((item: any) => ({
                question: item.question ?? item.questions,
                answer: item.answer
            }));

            return normalized;
        } catch (error) {
            console.error("Failed to parse AI response:", responseText);
            throw new Error("Invalid JSON format: " + (error as Error).message);
        }
    };



    const generateAIResponse = async (data: FormData) => {
        const prompt = `
        As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}

        The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
        `;


        const aiResult = await chatSession.sendMessage(prompt);
        return cleanAiResponse(await aiResult.response.text());
    };

    const onSubmit = async (formData: FormData) => {
        try {
            setLoading(true);


            if (initialData?.id) {
                await deleteDoc(doc(db, "interviews", initialData.id));

            }
            const aiResult = await generateAIResponse(formData);

            await addDoc(collection(db, "interviews"), {
                ...formData,
                userId,
                questions: aiResult,
                createdAt: serverTimestamp(),
            });

            toast(toastMessage.title, { description: toastMessage.description });
            navigate("/generate", { replace: true });
        } catch (error: any) {
            console.error(error);

            // Detect 503 Gemini overload
            if (error.message.includes("503")) {
                toast.error("Gemini is currently overloaded. Please try again in a few moments.");
            } else {
                toast.error("Something went wrong. Please try again later.");
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            form.reset({
                position: initialData.position,
                description: initialData.description,
                experience: initialData.experience,
                techStack: initialData.techStack,
            });
        }
    }, [initialData]);

    return (
        <div className="w-full flex-col space-y-4">
            <CustomBreadCrumb breadCrumbPage={breadCrumbPage} breadCrumbItems={[{ label: "Mock Interview", link: "/generate" }]} />
            <div className="mt-4 flex items-center justify-between w-full">
                <Headings title={title} isSubHeading />
            </div>
            <Separator className="my-4" />
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-8 rounded-lg flex flex-col gap-6 border shadow-md">
                    {(["position", "description", "experience", "techStack"] as (keyof FormData)[]).map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                                <FormItem className="w-full space-y-4">
                                    <div className="flex justify-between">
                                        <FormLabel className="capitalize">{fieldName}</FormLabel>
                                        <FormMessage className="text-sm" />
                                    </div>
                                    <FormControl>
                                        {fieldName === "description" || fieldName === "techStack" ? (
                                            <Textarea disabled={loading} className="h-12" placeholder={`Enter ${fieldName}`} {...field} value={field.value || ""} />
                                        ) : (
                                            <Input
                                                disabled={loading}
                                                type={fieldName === "experience" ? "number" : "text"}
                                                className="h-12"
                                                placeholder={`Enter ${fieldName}`}
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        )}
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}

                    <div className="flex justify-end gap-4 w-full">
                        <Button type="reset" variant="outline" size="sm" disabled={isSubmitting || loading}>Reset</Button>
                        <Button type="submit" size="sm" variant="default" disabled={isSubmitting || loading || !isValid}>
                            {loading ? <Loader className="text-white animate-spin" /> : actions}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default FormMockInterview;
