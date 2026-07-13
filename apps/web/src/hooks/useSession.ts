import api from "@/lib/api"
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query"

const DEFAULT_PAGE_SIZE = 10;

export const useInfiniteGetSessions = (limit: number = DEFAULT_PAGE_SIZE) => {
 return useInfiniteQuery({
  queryKey: ["session", "infinite", { limit }],
  queryFn: ({ pageParam }) => api.sessions.getSessions(pageParam, limit),
  initialPageParam: 0,
  getNextPageParam: (lastPage, _allPages, lastPageParam) => {
   const sessions = lastPage?.data?.sessions ?? [];
   if (sessions.length === limit) {
    return lastPageParam + limit;
   }
   return undefined;
  },
 })
}

export const useCreateSession = () => {
 return useMutation({
  mutationKey: ["session", "create"],
  mutationFn: (file: File) => api.sessions.createSession(file),
 })
}

export const useChat = () => {
 return useMutation({
  mutationKey: ["session", "chat"],
  mutationFn: (data: { sessionId: string, message: string }) => api.sessions.chat(data.sessionId, data.message),
 })
}

export const useGetSessions = (offset?: number, limit?: number) => {
 return useQuery({
  queryKey: ["session", "get", { offset, limit }],
  queryFn: () => api.sessions.getSessions(offset, limit),
 })
}

export const useGetSession = (sessionId: string) => {
 return useQuery({
  queryKey: ["session", sessionId, "get", "detail"],
  queryFn: () => api.sessions.getSession(sessionId),
  enabled: !!sessionId,
 })
}

export const useInfiniteGetSessionChats = (sessionId: string, limit: number = DEFAULT_PAGE_SIZE) => {
 return useInfiniteQuery({
  queryKey: ["session", sessionId, "chats", "infinite", { limit }],
  queryFn: ({ pageParam }) => api.sessions.getSession(sessionId, pageParam, limit),
  initialPageParam: 0,
  getNextPageParam: (lastPage, _allPages, lastPageParam) => {
   const chats = lastPage?.data?.chats ?? [];
   if (chats.length === limit) {
    return lastPageParam + limit;
   }
   return undefined;
  },
  enabled: !!sessionId,
 })
}