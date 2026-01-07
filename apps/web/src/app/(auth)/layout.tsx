import Link from "next/link";
import { FileText } from "lucide-react";
import GuestGuard from "@/components/provider/guest-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="px-6 py-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                <FileText className="h-4 w-4 text-background" />
              </div>
              <span className="font-semibold text-lg">DocChat</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-in">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          © 2026 DocChat. All rights reserved.
        </footer>
      </div>
    </GuestGuard>
  );
}
