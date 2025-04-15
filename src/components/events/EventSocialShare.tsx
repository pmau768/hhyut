import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Link, Mail } from "lucide-react";

interface EventSocialShareProps {
  event: {
    id: string;
    title: string;
    shortDescription: string;
  };
  shareUrl: string;
}

const EventSocialShare = ({ event, shareUrl }: EventSocialShareProps) => {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(event.title);
  const encodedDesc = encodeURIComponent(event.shortDescription);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You can add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Link className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 justify-center">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href={shareLinks.email}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          <div className="flex gap-2">
            <Input value={shareUrl} readOnly />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventSocialShare;