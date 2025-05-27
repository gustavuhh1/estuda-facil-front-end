"use client";
import { useSession } from "next-auth/react";



export default function Perfil() {
  const { data: session} = useSession();

  return (
    <>
      <h1 style={{ padding: "2rem" }}>Página de Perfil</h1>
      {session && <pre>{JSON.stringify(session, null, 2)}</pre>}
    </>
  );
}
