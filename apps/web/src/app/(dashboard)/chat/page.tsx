"use client";

import { useState } from "react";
import { Zap, Sparkles, Shield } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { ChatInterface } from "@/components/chat-interface";
import type { CreateSessionResponse, ChatMessage } from "@/types/api";
import { useCreateSession, useChat } from "@/hooks/useSession";

export default function ChatPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [session, setSession] = useState<CreateSessionResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [documentName, setDocumentName] = useState("");
  const { mutateAsync: createSession } = useCreateSession();
  const { mutateAsync: sendChat, isPending: isLoading } = useChat();

  const handleFileSelect = async (file: File) => {
    setUploadError("");
    setIsUploading(true);
    setDocumentName(file.name);

    try {
      const response = await createSession(file);
      if (response.success) {
        setSession(response.data);
      } else {
        setUploadError(response.message || "Failed to upload document");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setUploadError(error.message);
      } else {
        setUploadError("Failed to upload document. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!session) return;

    // Add user message
    const userMessage: ChatMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendChat({ sessionId: session.session_token, message });
      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Show error as assistant message
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Show upload state
  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Start a new conversation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a document to get instant answers, summaries, and insights powered by AI.
            </p>
          </div>

          <FileUpload
            onFileSelect={handleFileSelect}
            isUploading={isUploading}
            error={uploadError}
          />

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[
              {
                title: "Instant Answers",
                description: "Ask any question and get accurate responses based on your document.",
                icon: Zap,
              },
              {
                title: "Smart Summaries",
                description: "Get concise summaries of long documents in seconds.",
                icon: Sparkles,
              },
              {
                title: "Secure & Private",
                description: "Your documents are processed locally and never shared.",
                icon: Shield,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface
  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      documentName={documentName}
      docUrl={session?.doc_url}
    />
  );
}
