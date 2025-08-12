import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { X, Lightbulb } from "lucide-react";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: string) => void;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  onSubmit,
}: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (feedback.trim()) {
      onSubmit(feedback.trim());
      setFeedback("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setFeedback("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <DialogTitle className="font-ubuntu font-medium">
              Provide Additional Feedback
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder=""
            className="w-full h-32 p-3 border border-border rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-open-sans text-sm"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="px-6 font-open-sans bg-primary/80 hover:bg-primary"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
