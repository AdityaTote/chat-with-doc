import api from "@/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"

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

export const useGetSessions = () => {
 return useQuery({
  queryKey: ["session", "get"],
  queryFn: () => api.sessions.getSessions(),
 })
}

export const useGetSession = (sessionId: string) => {
 return useQuery({
  queryKey: ["session", sessionId, "get", "detail"],
  queryFn: () => api.sessions.getSession(sessionId),
  enabled: !!sessionId,
 })
}