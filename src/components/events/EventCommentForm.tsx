import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface EventCommentFormProps {
  userImageUrl: string;
  userName: string;
  onSubmit: (content: string) => void;
}

const EventCommentForm = ({
  userImageUrl,
  userName,
  onSubmit,
}: EventCommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === "" || isSubmitting) return;
    
    setIsSubmitting(true);
    onSubmit(comment);
    setComment("");
    setIsSubmitting(false);
  };

  const characterCount = comment.length;
  const charactersLeft = maxLength - characterCount;
  const isAtLimit = charactersLeft <= 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={userImageUrl}
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, maxLength))}
            placeholder="Add a comment..."
            className="resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className={isAtLimit ? "text-destructive" : ""}>
                {charactersLeft}
              </span> characters left
            </div>
            <Button 
              type="submit" 
              size="sm"
              disabled={comment.trim() === "" || isSubmitting}
              className="flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              Post
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EventCommentForm;