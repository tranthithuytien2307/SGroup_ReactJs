import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";

type GenericFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { name: string; description?: string };
  onSubmit: (data: { name: string; description?: string }) => void;
  texts: {
    title: string;
    description: string;
    labelName: string;
    placeholderName: string;
    labelDescription: string;
    placeholderDescription: string;
    buttonCancel: string;
    buttonAction: string;
  };
  requireName?: boolean;
  autoFocusName?: boolean;
};

export default function GenericFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  texts,
  requireName = true,
  autoFocusName = true,
}: GenericFormModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setDescription(initialData?.description || "");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (open && autoFocusName && nameInputRef.current) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
        nameInputRef.current?.select();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, autoFocusName]);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (requireName && !trimmedName) return;
    onSubmit({
      name: trimmedName,
      description: description.trim() || undefined,
    });
    onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {texts.title}
          </DialogTitle>
          <DialogDescription>{texts.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{texts.labelName}</label>
            <Input
              ref={nameInputRef}
              placeholder={texts.placeholderName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {texts.labelDescription}
            </label>
            <Textarea
              placeholder={texts.placeholderDescription}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="mr-2 cursor-pointer"
          >
            {texts.buttonCancel}
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSubmit}
            disabled={requireName && !name.trim()}
          >
            {texts.buttonAction}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
