import { useState } from "react";
import { DogProfile, Event } from "@/lib/types";
import { getCompatibilityReasons } from "@/lib/dogEventCompatibility";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventCompatibilityProps {
  dog: DogProfile;
  event: Event;
  compact?: boolean;
}

export function EventCompatibility({ dog, event, compact = false }: EventCompatibilityProps) {
  const [showDetails, setShowDetails] = useState(false);
  const compatibility = getCompatibilityReasons(dog, event);
  const score = compatibility.score;
  
  // Function to determine the color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // For compact view, just show a badge with the score
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
              className="cursor-help"
            >
              {score}% match
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">Compatibility with {dog.name}</p>
            {compatibility.positives.length > 0 && (
              <div className="mt-1">
                <div className="text-xs text-green-500">{compatibility.positives[0]}</div>
              </div>
            )}
            {compatibility.negatives.length > 0 && (
              <div className="mt-1">
                <div className="text-xs text-red-500">{compatibility.negatives[0]}</div>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">
            Compatibility with {dog.name}
          </h4>
          <Badge 
            variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}
          >
            {score}%
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="h-7 w-7 p-0"
        >
          {showDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <Progress value={score} className={`h-2 ${getScoreColor(score)}`} />
      
      {showDetails && (
        <div className="pt-2 text-sm space-y-2">
          {compatibility.positives.length > 0 && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-muted-foreground">Good match because:</h5>
              <ul className="space-y-1">
                {compatibility.positives.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {compatibility.negatives.length > 0 && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-muted-foreground">Considerations:</h5>
              <ul className="space-y-1">
                {compatibility.negatives.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-red-600">
                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 