"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat-interface";
import type { ChatMessage } from "@/types/api";
import { Loader2 } from "lucide-react";
import { useGetSession, useChat } from "@/hooks/useSession";

export default function SessionChatPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const { data: sessionData, isLoading: isFetching } = useGetSession(sessionId);
  const { mutateAsync: sendChat, isPending: isLoading } = useChat();

  useEffect(() => {
    if (sessionData?.success && sessionData.data?.chats) {
      const chatMessages: ChatMessage[] = sessionData.data.chats
        .map((chat) => ({
          role: chat.role,
          content: chat.message,
        }))
        .reverse();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(chatMessages);
    }
  }, [sessionData]);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendChat({ sessionId, message });
      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (isFetching) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  console.log(sessionData?.data)

  const documentName = sessionData?.data?.session?.document_name;
  const sessionName = sessionData?.data?.session?.title ?? undefined;
  const docUrl = sessionData?.data?.session?.document_url;

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      documentName={documentName}
      sessionName={sessionName}
      docUrl={docUrl}
    />
  );
}
