import { useMutation, useQuery } from "@tanstack/react-query"

import api from "@/lib/api"
import { useAuthStore, useTokenStore } from "@/store/user.store";

export const useSignup = () => {
  const { setToken } = useTokenStore();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: (data: { email: string; password: string }) => api.auth.signup(data),
    onSuccess: (data) => {
      setToken(data.data.token);
      setUser(data.data.user);
    },
    onError: () => {
      setToken(null);
      setUser(null);
    },
  });
};

export const useSignin = () => {
  const { setToken } = useTokenStore();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationKey: ["auth", "signin"],
    mutationFn: (data: { email: string; password: string }) => api.auth.signin(data),
    onSuccess: (data) => {
      setToken(data.data.token);
      setUser(data.data.user);
    },
    onError: () => {
      setToken(null);
      setUser(null);
    },
  });
};

export const useAuth = () => {
 return useQuery({
  queryKey: ["auth", "me"],
  queryFn: () => api.auth.me(),
  refetchOnWindowFocus: false,
  staleTime: 60 * 60 * 1000,
 })
}