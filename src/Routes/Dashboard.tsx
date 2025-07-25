import { Button } from "@/components/ui/button";
import Headings from "@/components/ui/Headings";
import InterviewPin from "@/components/ui/InterviewPin";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import type { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        }) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error on fetching : ", error);
        toast.error("Error..", {
          description: "Something went wrong.. Try again later..",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 py-4">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between mt-4">
        <Headings
          title="Dashboard"
          description="Create and start your AI Mock interview"
        />
        <Link to={"/generate/create"}>
          <Button size={"sm"}>
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </Button>
        </Link>
      </div>

      <Separator className="my-8" />

      {/* Responsive Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 py-4">
  {loading ? (
    Array.from({ length: 9 }).map((_, index) => (
      <Skeleton key={index} className="h-[240px] w-full rounded-md" />
    ))
  ) : interviews.length > 0 ? (
    interviews.slice(0, 9).map((interview) => (
      <InterviewPin key={interview.id} interview={interview} />
    ))
  ) : (
    <div className="col-span-full w-full flex flex-col items-center justify-center h-96">
      <img
        src="/assets/svg/not-found.svg"
        className="w-44 h-44 object-contain"
        alt="No Data Found"
      />
      <h2 className="text-lg font-semibold text-muted-foreground mt-4">
        No Data Found
      </h2>
      <p className="w-full max-w-md text-center text-sm text-neutral-400 mt-2">
        There is no available data to show. Please add some new mock interviews.
      </p>
      <Link to={"/generate/create"} className="mt-4">
        <Button size={"sm"}>
          <Plus className="w-4 h-4 mr-1" />
          Add New
        </Button>
      </Link>
    </div>
  )}
</div>

    </div>
  );
};

export default Dashboard;
