import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventCommentFormProps {
  avatar?: string;
  userImageUrl?: string; // Kept for backward compatibility
  userName: string;
  onSubmit: (content: string) => void;
}

const EventCommentForm = ({ avatar, userImageUrl, userName, onSubmit }: EventCommentFormProps) => {
  const [content, setContent] = useState("");
  const imageUrl = avatar || userImageUrl;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={imageUrl} alt={userName} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Share your thoughts about this event..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim()}>
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export default EventCommentForm;