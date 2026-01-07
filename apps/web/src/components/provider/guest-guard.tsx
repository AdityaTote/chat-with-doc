"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenStore } from "@/store/user.store";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token } = useTokenStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && token) {
      router.push("/chat");
    }
  }, [token, router, mounted]);

  if (!mounted) {
    return null;
  }

  if (token) {
    return null;
  }

  return <>{children}</>;
}
