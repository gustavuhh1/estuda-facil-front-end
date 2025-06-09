"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function UserNav() {
  const session = useSession();
  const nameUser = session.data?.user.nome;
  const cargoUser = session.data?.user.role;
  const nameUserformat = nameUser?.toLocaleUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 rounded-full gap-2">
          <Avatar className="h-8 w-8 bg-primary">
            <AvatarImage alt="Gustavo">{nameUserformat?.charAt(0)}</AvatarImage>
            <AvatarFallback>{nameUserformat?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">
            {nameUserformat ? nameUserformat : "Perfil sem nome."}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {nameUserformat?.toLowerCase() ?? "Perfil sem nome."}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{cargoUser}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <Link href={"/perfil"}>Perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
        <Link
          className="cursor-pointer"
          href={"/login"}
          onClick={() => signOut({callbackUrl: "/login"})}
        >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
        </Link>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
