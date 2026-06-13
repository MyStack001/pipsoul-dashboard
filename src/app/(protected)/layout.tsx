import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-60">
        <Sidebar />
      </aside>

      {/* Right Section */}
      <div className="ml-60 flex flex-1 flex-col">

        {/* Fixed Topbar */}
        <header className="fixed top-0 left-60 right-0 z-50">
          <Topbar />
        </header>

        {/* Scrollable Main Content */}
        <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 bg-gray-50 dark:bg-[#0B0F19]">
          {children}
        </main>

      </div>
    </div>
  );
}