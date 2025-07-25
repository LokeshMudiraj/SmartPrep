import type { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { Card, CardDescription, CardFooter, CardTitle } from "./card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ToolTipButton } from "./ToolTipButton";
import { Eye, Newspaper, Sparkles, Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface InterviewPinProps {
    interview: Interview;
    onMockPage?: boolean;
}

const InterviewPin = ({ interview, onMockPage = false }: InterviewPinProps) => {
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "interviews", interview.id));
            toast.success("Interview deleted");
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete interview");
        }
    };

    return (
        <Card
            className={cn(
                "flex flex-col justify-between p-4 rounded-md shadow hover:shadow-md transition-all overflow-hidden w-full h-full min-h-[240px]"
            )}
        >
            {/* Top Section */}
            <div className="flex flex-col gap-2 overflow-hidden">
                <CardTitle className="text-base font-semibold break-words line-clamp-2">
                    {interview?.position}
                </CardTitle>

                <CardDescription className="text-sm text-muted-foreground line-clamp-2 break-words">
                    {interview?.description}
                </CardDescription>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-2 mt-2 max-h-[50px] overflow-hidden">
                    {(interview.techStack?.split(",") || []).map((tech, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="text-[10px] max-w-[90px] truncate cursor-pointer hover:bg-purple-100 hover:text-primary transition-colors"
                        >
                            {tech.trim()}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <CardFooter className="pt-3 flex justify-between items-center">
                <p className="text-[12px] text-muted-foreground truncate">
                    {new Date(interview?.createdAt.toDate()).toLocaleString("en-US", {
                        dateStyle: "long",
                        timeStyle: "short",
                    })}
                </p>

                {!onMockPage && (
                    <div className="flex gap-1 shrink-0">
                        <ToolTipButton
                            content="View"
                            buttonVariant="ghost"
                            onClick={() =>
                                navigate(`/generate/${interview.id}`, { replace: true })
                            }
                            buttonClassName="hover:text-green-500"
                            icon={<Eye className="w-4 h-4" />}
                            loading={false}
                        />
                        <ToolTipButton
                            content="Feedback"
                            buttonVariant="ghost"
                            onClick={() =>
                                navigate(`/generate/feedback/${interview.id}`, { replace: true })
                            }
                            buttonClassName="hover:text-yellow-500"
                            icon={<Newspaper className="w-4 h-4" />}
                            loading={false}
                        />
                        <ToolTipButton
                            content="Start"
                            buttonVariant="ghost"
                            onClick={() =>
                                navigate(`/generate/interview/${interview.id}`, { replace: true })
                            }
                            buttonClassName="hover:text-sky-500"
                            icon={<Sparkles className="w-4 h-4" />}
                            loading={false}
                        />

                        {/* Delete with Alert */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <ToolTipButton
                                    content="Delete"
                                    buttonVariant="ghost"
                                    onClick={() => { }}
                                    buttonClassName="hover:text-red-500"
                                    icon={<Trash2 className="w-4 h-4" />}
                                    loading={false}
                                />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the
                                        interview record.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default InterviewPin;
