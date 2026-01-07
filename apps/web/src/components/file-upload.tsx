"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, File, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/markdown": [".md"],
  "text/plain": [".txt"],
};

const FORMAT_LABELS = [
  { ext: ".pdf", name: "PDF", icon: "📄" },
  { ext: ".docx", name: "Word", icon: "📝" },
  { ext: ".md", name: "Markdown", icon: "📋" },
  { ext: ".txt", name: "Text", icon: "📃" },
];

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  error?: string;
}

export function FileUpload({ onFileSelect, isUploading, error }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]!;
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: isUploading,
  });

  const rejectionError = fileRejections.length > 0 
    ? "Unsupported file format. Please upload a PDF, DOCX, MD, or TXT file."
    : null;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-foreground bg-muted/50"
            : "border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/30",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
          ) : selectedFile ? (
            <div className="h-14 w-14 rounded-2xl bg-foreground flex items-center justify-center">
              <FileText className="h-7 w-7 text-background" />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <Upload className="h-7 w-7 text-muted-foreground" />
            </div>
          )}

          {isUploading ? (
            <div>
              <p className="font-medium">Processing document...</p>
              <p className="text-sm text-muted-foreground mt-1">
                This may take a few seconds
              </p>
            </div>
          ) : selectedFile ? (
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div>
              <p className="font-medium">
                {isDragActive ? "Drop your document here" : "Drop a document here or click to browse"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start a conversation with your document
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Supported formats */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {FORMAT_LABELS.map((format) => (
          <div
            key={format.ext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm"
          >
            <span>{format.icon}</span>
            <span className="text-muted-foreground">{format.name}</span>
          </div>
        ))}
      </div>

      {/* Error display */}
      {(error || rejectionError) && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error || rejectionError}</span>
        </div>
      )}
    </div>
  );
}
