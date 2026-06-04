"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  fileName: string | null;
  onClear: () => void;
  disabled?: boolean;
}

export function UploadDropzone({
  onFileSelect,
  fileName,
  onClear,
  disabled,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || file.type !== "application/pdf") return;
      onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Upload className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">Drop your resume PDF here</p>
          <p className="mt-1 text-muted-foreground text-xs">or click to browse (max 5 MB)</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {fileName && (
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="size-4 shrink-0 text-primary" />
            <span className="truncate text-sm">{fileName}</span>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClear} disabled={disabled}>
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
