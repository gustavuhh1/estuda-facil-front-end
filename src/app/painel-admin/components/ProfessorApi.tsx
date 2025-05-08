import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import styled from "styled-components";

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

// function FormAluno(){
//   return(
//     <Form>
//       <form>
        
//       </form>
//     </Form>
//   )
// }

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

              {/* Inserir Formulario para criar Aluno */}
              <DialogDescription></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">
            Atualizar Tarefa
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insira os dados do Aluno:</DialogTitle>

              {/* Inserir Formulario para criar Aluno */}
              <DialogDescription></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">
            Excluir Tarefa
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insira os dados do Aluno:</DialogTitle>

              {/* Inserir Formulario para criar Aluno */}
              <DialogDescription></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="bg-zinc-400 rounded p-2">
            Mandar mensagem
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insira os dados do Aluno:</DialogTitle>

              {/* Inserir Formulario para criar Aluno */}
              <DialogDescription></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}
