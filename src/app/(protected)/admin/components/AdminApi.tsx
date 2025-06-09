import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfessorCRUD } from "./ProfessorCRUD";
import { AlunoCRUD } from "./AlunoCRUD";
import { TurmaCRUD } from "./TurmaCRUD";
const Box = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2d4d3a;
`;

export default function AdminAPI() {
  return (
    <Box>
      <Title>Admin API</Title>
      <p>Teste de funcionalidades do painel administrativo.</p>
      <div className="py-8 flex flex-col gap-6">
        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">
            CRUD Professor
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Administrar Professores</DialogTitle>

              <DialogDescription><ProfessorCRUD/></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">
            CRUD Alunos
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Administrar Alunos</DialogTitle>

              <DialogDescription><AlunoCRUD/></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">
            CRUD Turmas
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Administrar Turmas</DialogTitle>

              <DialogDescription><TurmaCRUD/></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}
