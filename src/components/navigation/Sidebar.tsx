"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Users, Calendar, Trello, Trash2 } from "lucide-react";

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
    title: "Kontakte",
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
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    router.push(href);
  };

  return (
    <div className={cn("bg-background", className)}>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="ml-2 mt-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menü öffnen</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold">callflows CRM</h2>
            </div>
            <nav className="flex-1 overflow-auto p-2">
              <ul className="grid gap-1 p-2">
                {navItems.map((item) => (
                  <li key={item.href}>
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
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      {/* Desktop Navigation */}
      <div className="hidden h-screen flex-col border-r lg:flex">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">callflows CRM</h2>
        </div>
        <nav className="flex-1 overflow-auto p-2 w-[259px]">
          <ul className="grid gap-1 p-2">
            {navItems.map((item) => (
              <li key={item.href}>
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
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
