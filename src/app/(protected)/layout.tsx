import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Toaster  } from "sonner";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  if(!session){
    redirect("/login")
  }


  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Container principal */}
      <div className="flex flex-col flex-1">
        {/* Topbar fixa */}
        <Topbar />
        {/* Conteúdo rolável */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">{children}</main>
        <Toaster/>
      </div>
    </div>
  );
}
