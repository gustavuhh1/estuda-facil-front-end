"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import { z } from "zod";
import { signIn } from "next-auth/react";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(25, "Senha muito longa"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Tratamento especial para o usuário de demonstração
        if (data.email === "gustavo@estudafacil.edu.br" && data.password === "password") {
          // Tenta novamente com credenciais exatas
          const demoResult = await signIn("credentials", {
            email: "gustavo@estudafacil.edu.br",
            password: "password",
            redirect: false,
          });
          
          if (demoResult?.error) {
            throw new Error("Erro no login de demonstração");
          }
        } else {
          throw new Error("Credenciais inválidas");
        }
      }

      // Redireciona para dashboard após login bem-sucedido
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      setError(
        error instanceof Error 
          ? error.message 
          : "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full max-w-md text-center mb-8 flex flex-col items-center">
        <Image
          className="size-[9.375rem] m-5"
          src="/logo.png"
          alt="Ícone de livro branco com fundo verde, Logo Estuda Fácil"
          width={150}
          height={150}
          priority
        />
        <h1 className="text-3xl font-bold">Estuda Fácil</h1>
        <p className="text-muted-foreground mt-1">Sistema de gestão escolar</p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Acesso ao sistema</CardTitle>
          <CardDescription>
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        {...field} 
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="******" 
                        {...field} 
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-sm text-center text-muted-foreground">
            <div className="flex flex-col items-center mt-6 space-y-2">
              <div>
                <strong>Demonstração:</strong>
              </div>
              <div className="text-center">
                <p>Email: gustavo@estudafacil.edu.br</p>
                <p>Senha: password</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}