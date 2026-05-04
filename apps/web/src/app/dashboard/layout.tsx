import { Sidebar } from "@/components/Sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="px-5 py-6 sm:px-8 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
