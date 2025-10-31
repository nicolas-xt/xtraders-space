import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { statusPresets } from "@shared/schema";
import { Check } from "lucide-react";

interface StatusMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: string | undefined;
  onSave: (status: string) => void;
}

export function StatusMessageDialog({
  open,
  onOpenChange,
  currentStatus,
  onSave,
}: StatusMessageDialogProps) {
  const [customInput, setCustomInput] = useState(currentStatus || "");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSave = () => {
    const statusToSave = selectedPreset || customInput.trim();
    if (statusToSave) {
      onSave(statusToSave);
    }
    onOpenChange(false);
  };

  const handleClear = () => {
    onSave("");
    onOpenChange(false);
  };

  const handlePresetClick = (preset: string) => {
    setSelectedPreset(preset);
    setCustomInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set custom status</DialogTitle>
          <DialogDescription>
            Let your team know what you're up to
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Quick presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {statusPresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  className={`justify-start gap-2 ${
                    selectedPreset === preset.label ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handlePresetClick(preset.label)}
                  data-testid={`button-preset-${preset.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span>{preset.emoji}</span>
                  <span className="truncate">{preset.label}</span>
                  {selectedPreset === preset.label && (
                    <Check className="ml-auto w-4 h-4 text-primary" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-status">Or write your own</Label>
            <Input
              id="custom-status"
              placeholder="e.g., Working from home today"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setSelectedPreset(null);
              }}
              maxLength={50}
              data-testid="input-custom-status"
            />
            <p className="text-xs text-muted-foreground">
              {customInput.length}/50 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {currentStatus && (
            <Button
              variant="ghost"
              onClick={handleClear}
              data-testid="button-clear-status"
            >
              Clear status
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-status"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedPreset && !customInput.trim()}
              data-testid="button-save-status"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
