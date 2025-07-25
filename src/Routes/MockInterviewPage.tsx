import type { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import LoaderPage from "./LoaderPage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import CustomBreadCrumb from "@/components/ui/CustomBreadCrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import QuestionForm from "@/components/ui/QuestionForm";

const MockInterviewPage = () => {
    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!interviewId) {
            navigate("/generate", { replace: true });
            return;
        }

        const fetchInterview = async () => {
            try {
                const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
                if (interviewDoc.exists()) {
                    setInterview({ id: interviewDoc.id, ...interviewDoc.data() } as Interview);
                } else {
                    setInterview(null);
                }
            } catch (error) {
                console.error("Error fetching interview:", error);
                setInterview(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterview();
    }, [interviewId, navigate]);

    useEffect(() => {
        if (!isLoading && !interview) {
            navigate("/generate", { replace: true });
        }
    }, [interview, isLoading, navigate]);

    if (isLoading) {
        return <LoaderPage className="w-full h-[70vh]" />;
    }

    return (
        <div className="flex flex-col w-full gap-8 py-5">
            <CustomBreadCrumb
                breadCrumbPage="Start"
                breadCrumbItems={[
                    { label: "Mock Interviews", link: "/generate" },
                    {
                        label: interview?.position || "",
                        link: `/generate/interviews/${interview?.id}`,
                    },
                ]}
            />

            <div className="w-full">
                <Alert className="bg-sky-100/50 border-sky-200 p-4 rounded-lg flex items-start gap-3 -mt-3">
                    <Lightbulb className="h-5 w-5 text-sky-600" />
                    <div>
                        <AlertTitle className="text-sky-800 font-semibold">Important Information</AlertTitle>
                        <AlertDescription className="text-sm text-sky-700 mt-1">
                            Please enable your webcam and microphone to start the AI-generated mock interview.
                            The interview consists of five questions. You’ll receive a personalized report based
                            on your responses at the end.
                            <br />
                            <br />
                            <span className="font-medium">Note:</span>
                            <p>
                                Your video is <strong>never recorded</strong>. You can disable your webcam at any
                                time.
                            </p>
                        </AlertDescription>
                    </div>
                </Alert>
            </div>

            {interview?.questions && interview.questions.length > 0 && (
                <div className="mt-4 w-full flex-col items-start gap-4">
                    <QuestionForm questions={interview.questions} />
                </div>
            )}
        </div>
    );
};

export default MockInterviewPage;
