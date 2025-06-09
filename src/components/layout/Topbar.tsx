import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { ThemeToggle } from "./ThemeToggle";

export default function Topbar() {
  


  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <div className="flex items-center ml-auto gap-4">
        <ThemeToggle/>
        <Button variant="outline" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notificações</span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
