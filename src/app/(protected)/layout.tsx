import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar - Desktop only */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-60">
        <Sidebar />
      </aside>

      {/* Right Section */}
      <div className="flex min-w-0 flex-1 flex-col md:ml-60">

        {/* Topbar */}
        <header className="fixed top-0 left-0 right-0 z-50 md:left-60">
          <Topbar />
        </header>

        {/* Main Content */}
        <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gray-50 dark:bg-[#0B0F19]">
          {children}
        </main>

      </div>
    </div>
  );
}