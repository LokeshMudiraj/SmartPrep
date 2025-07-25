import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Headings from "@/components/ui/Headings";
import { Brain, Rocket, Users, ClipboardList, Gauge, CheckCircle } from "lucide-react";

const services = [
  {
    icon: <Brain className="w-6 h-6 text-purple-600" />,
    title: "AI-Powered Mock Interviews",
    description: "Simulate real interview scenarios with AI-generated questions tailored to your role and experience level.",
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
    title: "Instant Skill Feedback",
    description: "Receive immediate evaluation on your answers, including strengths, areas of improvement, and score breakdown.",
  },
  {
    icon: <Users className="w-6 h-6 text-green-600" />,
    title: "Behavioral & Technical Rounds",
    description: "Practice both behavioral and technical interviews to build confidence across all question types.",
  },
  {
    icon: <Gauge className="w-6 h-6 text-orange-600" />,
    title: "Progress Tracking",
    description: "Visualize your progress over time with personalized analytics, trends, and improvement insights.",
  },
  {
    icon: <Rocket className="w-6 h-6 text-red-600" />,
    title: "Role-Based Preparation",
    description: "Choose your target job (e.g. Web Developer, Data Analyst, SDE) and get curated questions and guidance.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    title: "Smart Resume Insights",
    description: "Upload your resume and get feedback on strengths, red flags, and keyword suggestions.",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 md:px-16 lg:px-24 bg-background">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Heading */}
        <Headings
          title="Our Services"
          description="Smart Prep offers powerful tools to prepare you for real-world interviews with confidence."
        />

        <Separator />

        {/* Grid of Services */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                {service.icon}
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {service.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
