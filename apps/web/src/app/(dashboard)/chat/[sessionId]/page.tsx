"use client";

import { Loader2 } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";

import type { ChatMessage } from "@/types/api";
import { ChatInterface } from "@/components/chat-interface";
import { useInfiniteGetSessionChats, useChat } from "@/hooks/useSession";

const CHAT_PAGE_SIZE = 10;

export default function SessionChatPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  const {
    data,
    isLoading: isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGetSessionChats(sessionId, CHAT_PAGE_SIZE);

  const { mutateAsync: sendChat, isPending: isLoading } = useChat();

  // Get session metadata from the first page response
  const sessionMeta = data?.pages[0]?.data?.session;

  // Build the full message list: paginated (older) messages + locally-added new messages
  // Backend returns chats in DESC order, so we reverse each page and prepend older pages
  const paginatedMessages: ChatMessage[] = useMemo(() => {
    if (!data?.pages) return [];

    // Pages are in fetch order: page 0 = newest, page 1 = older, etc.
    // Each page's chats are in DESC order. We need chronological (ASC) order.
    const allPages = [...data.pages].reverse(); // oldest page first
    return allPages.flatMap(
      (page) =>
        (page?.data?.chats ?? [])
          .slice()
          .reverse()
          .map((chat) => ({
            role: chat.role,
            content: chat.message,
          })) as ChatMessage[]
    );
  }, [data]);

  // Combine paginated messages with locally-added new messages
  const messages = useMemo(
    () => [...paginatedMessages, ...localMessages],
    [paginatedMessages, localMessages]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = { role: "user", content: message };
    setLocalMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendChat({ sessionId, message });
      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.data.response,
        };
        setLocalMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        };
        setLocalMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (isFetching) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const documentName = sessionMeta?.document_name;
  const sessionName = sessionMeta?.title ?? undefined;
  const docUrl = sessionMeta?.document_url;

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      documentName={documentName}
      sessionName={sessionName}
      docUrl={docUrl}
      onLoadMore={handleLoadMore}
      isLoadingMore={isFetchingNextPage}
      hasMore={hasNextPage}
    />
  );
}