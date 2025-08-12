import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRating: (rating: number, feedback?: string) => void;
}

export function RatingDialog({
  open,
  onOpenChange,
  onSubmitRating,
}: RatingDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleRatingSubmit = () => {
    if (rating === 0) return;

    if (rating <= 3) {
      // For low ratings, show feedback form
      setShowFeedbackForm(true);
    } else {
      // For high ratings, submit directly
      onSubmitRating(rating);
      resetForm();
      onOpenChange(false);
    }
  };

  const handleFeedbackSubmit = () => {
    onSubmitRating(rating, feedback);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setFeedback("");
    setShowFeedbackForm(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="font-ubuntu font-medium">
            {showFeedbackForm
              ? "Provide Additional Feedback"
              : "Rate this conversation"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {!showFeedbackForm ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                How would you rate your experience with Soul AI?
              </p>

              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="p-1 transition-colors"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={cn(
                        "w-8 h-8 transition-colors",
                        hoveredRating >= star || rating >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={handleClose} className="px-6">
                Cancel
              </Button>
              <Button
                onClick={handleRatingSubmit}
                disabled={rating === 0}
                className="px-6"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      rating >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {rating} out of 5 stars
              </span>
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please tell us how we can improve..."
              className="w-full h-32 p-3 border border-border rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-open-sans text-sm"
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFeedbackForm(false)}
                className="px-6"
              >
                Back
              </Button>
              <Button onClick={handleFeedbackSubmit} className="px-6">
                Submit Feedback
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
