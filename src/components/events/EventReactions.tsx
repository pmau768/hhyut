import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, ThumbsUp, Star, PartyPopper as Party, Smile } from "lucide-react";

interface Reaction {
  id: string;
  icon: React.ReactNode;
  label: string;
  count: number;
}

interface EventReactionsProps {
  reactions: Reaction[];
  onReact: (reactionId: string) => void;
  userReactions: string[];
}

const EventReactions = ({ reactions, onReact, userReactions }: EventReactionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        {reactions.map((reaction) => (
          <Tooltip key={reaction.id}>
            <TooltipTrigger asChild>
              <Button
                variant={userReactions.includes(reaction.id) ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => onReact(reaction.id)}
              >
                {reaction.icon}
                <span>{reaction.count}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{reaction.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export const defaultReactions: Reaction[] = [
  { id: "like", icon: <ThumbsUp className="w-4 h-4" />, label: "Like", count: 0 },
  { id: "love", icon: <Heart className="w-4 h-4" />, label: "Love", count: 0 },
  { id: "excited", icon: <Star className="w-4 h-4" />, label: "Excited", count: 0 },
  { id: "going", icon: <Party className="w-4 h-4" />, label: "Going", count: 0 },
  { id: "interested", icon: <Smile className="w-4 h-4" />, label: "Interested", count: 0 },
];

export default EventReactions;