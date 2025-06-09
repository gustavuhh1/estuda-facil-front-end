"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Perfil() {
  const { data: session } = useSession();
  const partes = session?.user.nome?.split(" ");
  const userRole = session?.user.role;
  const iniciais =
    partes && partes.length >= 2
      ? partes[0][0] + partes[1][0]
      : session?.user.nome?.charAt(0);

  return (
    <div className="space-y-5">
      <h1 className="text-4xl font-bold text-black dark:text-white pb-1">Perfil</h1>
      <p className="text-sm text-zinc-400 pb-5">Gerencie suas informações pessoais</p>

      <main className="font-sans bg-card rounded border-1 xl:max-w-5xl">
        <section className="m-2 p-4 pb-6">
          <div className="flex items-center mb-10">
            <div className="bg-accent w-[68px] h-[68px] rounded-full flex justify-center items-center">
              <span className="text-2xl">{iniciais}</span>
            </div>
            <div className="ml-5">
              <h1 className="text-2xl font-medium ">{session?.user.nome}</h1>
              <p className="text-sm">{session?.user.email}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-zinc-500 font-sans">Função</p>
              <span>
                {[userRole].map((obj) => {
                  if (obj === "COORDENACAO") return "Cordenação";
                  if (obj === "PROFESSOR") return "Professor";
                  if (obj === "ALUNO") return "Aluno";
                  return "Sem cargo!";
                })}
              </span>
            </div>
            <div>
              <p className="text-zinc-500 font-sans">
                {[userRole].map((obj) => {
                  if (obj === "COORDENACAO") return "Departamento";
                  if (obj === "PROFESSOR") return "Disciplina";
                  if (obj === "ALUNO") return "Turma";
                  return "";
                })}
              </p>
              <span>
                {[userRole].map((obj) => {
                  if (obj === "COORDENACAO")
                    return session?.user.departamento ?? "Não informado";
                  if (obj === "PROFESSOR") return session?.user.disciplina;
                  if (obj === "ALUNO") return session?.user.turmaId;
                  return "Sem cargo!";
                })}
              </span>
            </div>
          </div>
        </section>
        <hr className="" />
        <div className="flex justify-between p-6">
          {/* TODO: fazer funcionalidade Atualizar perfil */}
          {/* <Button className="bg-gray-300 font-sans text-zinc-800 hover:text-white" size={"lg"}>Editar Perfil</Button> */}
          <Button variant={"destructive"} onClick={() => signOut()}>
            Sair
          </Button>
        </div>
      </main>
    </div>
  );
}
