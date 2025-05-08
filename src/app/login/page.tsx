"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";

const Container = styled.div`
  min-height: 100vh;
  background: #fef1e6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex-direction: column;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  img {
    width: 70px;
    height: 70px;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.6rem;
    color: #111;
  }
`;

const FormWrapper = styled.div`
  background: #6e8373;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);

  & .divLabels {
    display: grid;
    grid-template-rows: repeat(1, 1fr);
    align-items: center;
    gap: 8\px;
    
  }
`;

const Label = styled.label`
  color: #fff;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.6rem;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  margin-top: -6px;
`;

const Button = styled.button`
  background: #f6d9d3;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #eac4bb;
  }
`;

const ErrorMessage = styled.p`
  color: #fff0f0;
  background: #b44;
  padding: 0.6rem;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
`;

const Footer = styled.footer`
  margin-top: 2rem;
  padding: 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: #555;
`;

export default function LoginPage() {
  const [emailOuTelefone, setEmailOuTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setErro("");
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOuTelefone, senha }),
      });

      if (res.status === 200) {
        localStorage.setItem("logado", "true");
        router.push("/inicio");
      } else {
        setErro("Email ou senha inválidos.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
    }
  };

  return (
    <Container>
      <Logo>
        <Image src="/logo.png" alt="Logo Estuda Fácil" width={80} height={80}/>
        <h1>Estuda Fácil</h1>
      </Logo>

      <FormWrapper>
        <div className="divLabels">
          <Label>Email ou Telefone</Label>
          <Input
            type="text"
            value={emailOuTelefone}
            onChange={(e) => setEmailOuTelefone(e.target.value)}
          />

          <Label>Senha</Label>
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <Button onClick={handleLogin}>Entrar</Button>
        {erro && <ErrorMessage>{erro}</ErrorMessage>}
      </FormWrapper>

      <Footer>
        © 2025 Todos os direitos reservados. Proibida a reprodução ou distribuição sem
        autorização.
      </Footer>
    </Container>
  );
}
