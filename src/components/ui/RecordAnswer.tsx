import { useAuth } from "@clerk/clerk-react";
import {
    CircleStop,
    Loader,
    Mic,
    RefreshCw,
    Save,
    Video,
    VideoOff,
    WebcamIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import WebCam from "react-webcam";
import { ToolTipButton } from "./ToolTipButton";
import useSpeechToText from "react-hook-speech-to-text";
import type { ResultType } from "react-hook-speech-to-text";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { SaveModal } from "./SaveModal";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface RecordAnswerProps {
    question: { question: string; answer: string };
    isWebCam: boolean;
    setIsWebCam: (value: boolean) => void;
}

interface AIResponse {
    ratings: number;
    feedback: string;
}

const RecordAnswer = ({ question, isWebCam, setIsWebCam }: RecordAnswerProps) => {
    const {
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    const [userAnswer, setUserAnswer] = useState("");
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [aiResult, setAiResult] = useState<AIResponse | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { userId } = useAuth();
    const { interviewId } = useParams();

    const recordUserAnswer = async () => {
        if (isRecording) {
            stopSpeechToText();
            if (userAnswer?.length < 30) {
                toast.error("Error", {
                    description: "Your answer should be more than 30 characters",
                });
                return;
            }

            const aiResult = await generateResult(
                question.question,
                question.answer,
                userAnswer
            );
            console.log(aiResult);
            setAiResult(aiResult);
        } else {
            startSpeechToText();
        }
    };

    const cleanJsonResponse = (responseText: string): AIResponse => {
        try {
            let cleanText = responseText.trim();

            // Remove code block formatting
            cleanText = cleanText.replace(/```json|```|`/g, "");

            const jsonStart = cleanText.indexOf("{");
            const jsonEnd = cleanText.lastIndexOf("}");

            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error("No valid JSON object found");
            }

            let jsonString = cleanText.slice(jsonStart, jsonEnd + 1);

            // Escape problematic characters
            jsonString = jsonString.replace(/\\n/g, "\\\\n"); // double escape newlines
            jsonString = jsonString.replace(/[\b\f\r]/g, ""); // remove control characters

            const parsed = JSON.parse(jsonString);

            if (
                typeof parsed.ratings !== "number" ||
                typeof parsed.feedback !== "string"
            ) {
                throw new Error("Parsed JSON is not in expected format");
            }

            return parsed;
        } catch (error) {
            console.error("❌ Failed to parse AI response:\n", responseText);
            throw new Error("Invalid JSON format: " + (error as Error).message);
        }
    };

    const generateResult = async (
        qst: string,
        qstAns: string,
        userAns: string
    ): Promise<AIResponse> => {
        setIsAiGenerating(true);
        const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in strictly minified JSON format with the fields "ratings" (number) and "feedback" (string).
    `;

        try {
            const aiResult = await chatSession.sendMessage(prompt);
            const parsedResult: AIResponse = cleanJsonResponse(
                aiResult.response.text()
            );
            return parsedResult;
        } catch (error) {
            console.log(error);
            toast("Error", {
                description: "An error occurred while generating feedback",
            });
            return { ratings: 0, feedback: "Unable to generate feedback" };
        } finally {
            setIsAiGenerating(false);
        }
    };

    const recordNewAnswer = () => {
        setUserAnswer("");
        stopSpeechToText();
        setTimeout(() => {
            startSpeechToText();
        }, 500);
    };

    const saveUserAnswer = async () => {
        if (!aiResult) return;
        setLoading(true);
        const currentQuestion = question.question;

        try {
            console.log("Saving...", { userAnswer, aiResult });
            // save logic here (e.g., Firestore write)
            const userAnswerQuery = query(
                collection(db, "userAnswers"),
                where("userId", "==", userId),
                where("question", "==", currentQuestion)
            )
            const querySnap = await getDocs(userAnswerQuery)
            if (!querySnap.empty) {
                console.log("Query snap size", querySnap.size)
                toast.info("Already Answered", {
                    description: "You have already answered this question",
                });
                return;
            } else {
                // save the user answer

                await addDoc(collection(db, "userAnswers"), {
                    mockIdRef: interviewId,
                    question: question.question,
                    correct_ans: question.answer,
                    user_ans: userAnswer,
                    feedback: aiResult.feedback,
                    rating: aiResult.ratings,
                    userId,
                    createdAt: serverTimestamp(),
                });

                toast("Saved", { description: "Your answer has been saved.." });
            }
            setUserAnswer("");
            stopSpeechToText();
        } catch (error) {
            toast("Error", {
                description: "An error occurred while generating feedback.",
            });
            console.log(error);
        } finally {
            setLoading(false);
            setOpen(!open);
        }
    };

    useEffect(() => {
        const combineTranscripts = results
            .filter((result): result is ResultType => typeof result !== "string")
            .map((result) => result.transcript)
            .join(" ");

        setUserAnswer(combineTranscripts);
    }, [results]);

    return (
        <div className="w-full flex flex-col items-center gap-8 mt-4">
            <SaveModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={saveUserAnswer}
                loading={loading}
            />

            <div className="flex items-center justify-center w-full h-full">
                <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
                    {isWebCam ? (
                        <WebCam
                            onUserMedia={() => setIsWebCam(true)}
                            onUserMediaError={() => setIsWebCam(false)}
                            className="w-full h-full object-cover rounded-md"
                        />
                    ) : (
                        <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center gap-3">
                <ToolTipButton
                    content={isWebCam ? "Turn Off" : "Turn On"}
                    icon={
                        isWebCam ? (
                            <VideoOff className="min-w-5 min-h-5" />
                        ) : (
                            <Video className="min-w-5 min-h-5" />
                        )
                    }
                    onClick={() => setIsWebCam(!isWebCam)}
                />

                <ToolTipButton
                    content={isRecording ? "Stop Recording" : "Start Recording"}
                    icon={
                        isRecording ? (
                            <CircleStop className="min-h-5 min-w-5" />
                        ) : (
                            <Mic className="min-w-5 min-h-5" />
                        )
                    }
                    onClick={recordUserAnswer}
                />

                <ToolTipButton
                    content="Record Again"
                    icon={<RefreshCw className="min-w-5 min-h-5" />}
                    onClick={recordNewAnswer}
                />

                <ToolTipButton
                    content="Save Results"
                    icon={
                        isAiGenerating ? (
                            <Loader className="min-w-5 min-h-5 animate-spin text-purple-500" />
                        ) : (
                            <Save className="min-w-5 min-h-5" />
                        )
                    }
                    onClick={() => setOpen(true)}
                    disabled={!aiResult}
                />
            </div>

            <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
                <h2 className="text-lg font-semibold">Your Answer:</h2>
                <p className="text-sm mt-2 text-gray-700 whitespace-normal">
                    {userAnswer || "Start recording to see your answer here"}
                </p>
                {interimResult && (
                    <p className="text-sm text-gray-500 mt-2">
                        <strong>Current speech:</strong> {interimResult}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RecordAnswer;
