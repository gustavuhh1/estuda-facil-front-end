import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styled from "styled-components";
import { TarefaForm } from "./TarefaForm";
import { TarefaList } from "./TarefaList";

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

export default function ProfessorAPI() {
  return (
    <Box>
      <Title>Professor API</Title>
      <p>Teste de funcionalidades relacionadas ao professor.</p>

      <div className="py-8 flex flex-col gap-6">
        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">Criar tarefa</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criando Tarefa</DialogTitle>

              <DialogDescription>
                <TarefaForm isUpdate={false} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">
            Atualizar Tarefa
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Tarefa</DialogTitle>
              <DialogDescription>
                <TarefaForm isUpdate={true} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">
            Ver Tarefas
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tarefas Atuais</DialogTitle>

              {/* Inserir Formulario para criar Aluno */}
              <DialogDescription>
                <TarefaList/>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}
