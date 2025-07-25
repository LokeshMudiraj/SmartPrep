import { Separator } from "@/components/ui/separator";
import Headings from "@/components/ui/Headings";
import { Users, Goal, Lightbulb, HeartHandshake } from "lucide-react";

const coreValues = [
  {
    icon: <Goal className="w-6 h-6 text-blue-600" />,
    title: "Our Mission",
    description:
      "To empower job seekers with AI-driven tools that simulate real interviews, enhance confidence, and improve career outcomes.",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
    title: "Our Vision",
    description:
      "To become the global standard for interview preparation by making smart, accessible, and personalized coaching available to everyone.",
  },
  {
    icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
    title: "What We Believe",
    description:
      "Preparation and confidence should not be limited by cost or geography. Everyone deserves a fair shot at their dream job.",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 md:px-16 lg:px-24 bg-background">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Page Heading */}
        <Headings
          title="About Smart Prep"
          description="AI Interview Preparation, Reimagined for Everyone"
        />

        <Separator />

        {/* Who We Are */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Who We Are
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Smart Prep is a modern interview prep platform built for engineers,
            designers, and educators with a passion for career growth.
            We help you simulate job interviews using AI — with dynamic questions,
            real-time feedback, and progress analytics. Whether you're a student,
            job seeker, or career switcher, we're here to give you an edge.
          </p>
        </section>

        {/* Values / Mission / Vision */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((item, index) => (
            <div key={index} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all bg-card flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                {item.icon}
                <h3 className="font-semibold text-base">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </section>

        {/* The Team (Optional) */}
        <section className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Our Team</h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            We're a growing team of builders focused on accessibility, innovation,
            and outcome-driven learning. From software engineers to education experts,
            we collaborate to create tools that make job readiness more achievable for all.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
