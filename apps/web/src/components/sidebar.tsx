import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, LogOut, Plus, History, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";

export const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigation = [
    { name: "New Chat", href: "/chat", icon: Plus },
    { name: "History", href: "/sessions", icon: History },
  ];
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "border-r bg-muted/30 flex flex-col transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-accent z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <div className={cn("p-4 border-b", isCollapsed && "px-2")}>
        <Link href="/chat" className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-background" />
          </div>
          <span
            className={cn(
              "font-semibold text-lg transition-opacity duration-300",
              isCollapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            DocChat
          </span>
        </Link>
      </div>

      <nav className={cn("flex-1 p-4 space-y-2", isCollapsed && "px-2")}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span
                className={cn(
                  "transition-all duration-300 overflow-hidden whitespace-nowrap",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className={cn("p-4 border-t", isCollapsed && "px-2")}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
            isCollapsed && "justify-center px-0"
          )}
          onClick={handleSignOut}
          title={isCollapsed ? "Sign out" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span
            className={cn(
              "transition-all duration-300 overflow-hidden whitespace-nowrap",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
          >
            Sign out
          </span>
        </Button>
      </div>
    </aside>
  );
};