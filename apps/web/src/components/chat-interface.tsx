"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  documentName?: string;
  sessionName?: string;
  docUrl?: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  documentName,
  sessionName,
  docUrl,
  onLoadMore,
  isLoadingMore,
  hasMore,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);
  const prevMessageCountRef = useRef(0);

  // Scroll to bottom on initial load and when new messages arrive at the bottom
  useEffect(() => {
    if (isInitialLoadRef.current && messages.length > 0) {
      // Initial load — scroll to bottom immediately
      messagesEndRef.current?.scrollIntoView();
      isInitialLoadRef.current = false;
      prevMessageCountRef.current = messages.length;
      return;
    }

    const container = messagesContainerRef.current;
    if (!container) return;

    // If older messages were prepended (loaded via scroll-up), preserve scroll position
    if (prevScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const diff = newScrollHeight - prevScrollHeightRef.current;
      if (diff > 0) {
        // Let native scroll anchoring handle this, but keep a tiny adjustment if needed
        // container.scrollTop += diff; 
      }
      prevScrollHeightRef.current = 0;
      prevMessageCountRef.current = messages.length;
      return;
    }

    // New messages added at the bottom (user sent or received) — scroll to bottom
    if (messages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  // Scroll-up detection for loading older messages
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (!onLoadMore || !hasMore || isLoadingMore) return;
    if (isInitialLoadRef.current) return;

    if (container.scrollTop <= 100) {
      prevScrollHeightRef.current = container.scrollHeight;
      onLoadMore();
    }
  }, [onLoadMore, hasMore, isLoadingMore]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const [docWidth, setDocWidth] = useState(50);
  const isResizingRef = useRef(false);

  const startResizing = () => {
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    // eslint-disable-next-line react-hooks/immutability
    document.body.style.userSelect = "none";
  };

  const stopResizing = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
    // eslint-disable-next-line react-hooks/immutability
    document.body.style.userSelect = "";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setDocWidth(newWidth);
    }
  };

  return (
    <div className="flex h-full overflow-hidden max-h-full">
      {/* Document Viewer */}
      {docUrl && (
        <>
          <div 
            className="border-r bg-muted/10 hidden lg:block relative"
            style={{ width: `${docWidth}%` }}
          >
            <iframe
              src={docUrl}
              className="w-full h-full"
              title="Document Viewer"
            />
          </div>
          
          {/* Drag Handle */}
          <div
            className="w-1 hover:w-2 bg-border hover:bg-primary/50 cursor-col-resize transition-all duration-150 z-50 hidden lg:block -ml-0.5"
            onMouseDown={startResizing}
          />
        </>
      )}

      {/* Chat Area */}
      <div 
        className="flex flex-col h-full min-h-0 w-full max-lg:!w-full"
        style={docUrl ? { width: `${100 - docWidth}%` } : undefined}
      >
        {/* Header */}
        {(documentName || sessionName) && (
          <div className="border-b px-6 py-4">
            {sessionName && (
               <h2 className="font-semibold text-lg">{sessionName}</h2>
            )}
            {documentName && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>Chatting with</span>
                  <span className="font-medium text-foreground truncate max-w-75">{documentName}</span>
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Loading spinner for older messages */}
          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* All messages loaded indicator */}
          {hasMore === false && messages.length > 0 && (
            <p className="text-center text-xs text-muted-foreground py-2">
              Beginning of conversation
            </p>
          )}

          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div className="max-w-md">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-2">Start the conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Ask questions about your document, request summaries, or explore specific topics.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-4 animate-fade-in",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="shrink-0 h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-muted"
                    )}
                  >
                    <div className={cn(
                      "prose prose-sm max-w-none break-words",
                      message.role === "user" 
                        ? "prose-invert" 
                        : ""
                    )}>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre: ({ ...props }) => (
                            <div className="overflow-auto w-full my-2 bg-black/10 dark:bg-white/10 p-2 rounded-lg">
                              <pre {...props} />
                            </div>
                          ),
                          code: ({ ...props }) => (
                            <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5" {...props} />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                {message.role === "user" && (
                  <div className="shrink-0 h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                    <User className="h-4 w-4 text-background" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-4 animate-fade-in">
              <div className="shrink-0 h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your document..."
              className="flex-1 min-h-12 max-h-32 px-4 py-3 rounded-xl border bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={1}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 rounded-xl shrink-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
