import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Container principal */}
      <div className="flex flex-col flex-1">
        {/* Topbar fixa */}
        <Topbar />

        {/* Conteúdo rolável */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
