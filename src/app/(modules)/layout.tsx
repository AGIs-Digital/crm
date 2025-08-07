import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
