"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Users, Calendar, Trello, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Leads",
    href: "/kontakte",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Kalender",
    href: "/kalender",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Kanban",
    href: "/kanban",
    icon: <Trello className="h-5 w-5" />,
  },
  {
    title: "Papierkorb",
    href: "/papierkorb",
    icon: <Trash2 className="h-5 w-5" />,
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

function Sidebar({
  isCollapsed = false,
  onToggle,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <TooltipProvider>
      <div className={cn("bg-background h-full flex flex-col", className)}>
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-center">
          {isCollapsed ? (
            <Image
              src="/images/favicon.png"
              alt="callflows"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          ) : (
            <Image
              src="/images/callflows_brand_no_claim.png"
              alt="callflows CRM"
              width={150}
              height={40}
              className="h-8 w-auto"
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto p-2">
          <ul className="grid gap-1 p-2">
            {navItems.map((item) => (
              <li key={item.href}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavigation(item.href, e)}
                        className={cn(
                          "flex items-center justify-center rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          pathname.includes(item.href)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.icon}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavigation(item.href, e)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname.includes(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </TooltipProvider>
  );
}

export default Sidebar;
export { Sidebar };
