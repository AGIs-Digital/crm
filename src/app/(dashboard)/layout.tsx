import { Sidebar } from "@/components/navigation/Sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
      <Toaster />
    </div>
  );
}
