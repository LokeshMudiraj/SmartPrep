import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Send } from "lucide-react";
import Headings from "@/components/ui/Headings";
import { Separator } from "@/components/ui/separator";

const ContactUs = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 md:px-16 lg:px-24 bg-background">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Page Heading */}
        <Headings
          title="Contact Us"
          description="We’d love to hear from you. Send us your queries or feedback."
        />

        <Separator />

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium text-foreground">Email</p>
              <p>support@smartprep.ai</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium text-foreground">Office</p>
              <p>Hyderabad, Telangana<br />India - 500032</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input type="text" placeholder="Your Name" required />
            <Input type="email" placeholder="Your Email" required />
          </div>
          <Input type="text" placeholder="Subject" required />
          <Textarea placeholder="Your Message..." rows={6} required />

          <Button type="submit" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
