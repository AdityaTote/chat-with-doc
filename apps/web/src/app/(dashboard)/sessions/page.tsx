"use client";

import Link from "next/link";
import { FileText, MessageSquare, Calendar, Loader2, FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetSessions } from "@/hooks/useSession";
import type { Session } from "@/types/api";

export default function SessionsPage() {
  const { data, isLoading, error } = useGetSessions();
  
  const sessions: Session[] = data?.data?.sessions ?? [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Chat History</h1>
          <p className="text-muted-foreground">
            Continue conversations with your documents
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive mb-6">
            {error instanceof Error ? error.message : "Failed to load sessions"}
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold mb-2">No sessions yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start a new chat by uploading a document
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              New Chat
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/chat/${session.session_token}`}
                className="block"
              >
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted uppercase">
                          DOC
                        </span>
                      </div>
                        {session.title || "Untitled Session"}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(session.created_at)}</span>
                      </div>
                    </div>
                    <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
