import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

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

interface Aluno {
  id: string;
  nome: string;
  email: string;
  turmaId?: number;
}

interface Turma {
  id: number;
  nome: string;
}

export default function AlunoTurmaManager() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlunos = async () => {
    try {
      const response = await api.get("/aluno");
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  };

  const fetchTurmas = async () => {
    try {
      const response = await api.get("/turma");
      setTurmas(response.data);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  };

  useEffect(() => {
    fetchAlunos();
    fetchTurmas();
  }, []);

  const handleAtribuirTurma = async (alunoId: string, turmaId: number) => {
    setIsLoading(true);
    try {
      await api.put(`/aluno/${alunoId}/turma/${turmaId}`);
      toast.success("Turma atribuída com sucesso!");
      fetchAlunos();
    } catch (error) {
      console.error("Erro ao atribuir turma:", error);
      toast.error("Erro ao atribuir turma");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Title>Gestão de Alunos e Turmas</Title>
      <p>Atribuição de alunos às turmas</p>

      <div className="py-8 flex flex-col gap-6">
        {/* Dialog para atribuir turma a aluno */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Atribuir Turma a Aluno</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atribuir Turma</DialogTitle>
              <DialogDescription>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Selecione o Aluno</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      onChange={(e) => {
                        const aluno = alunos.find(a => a.id === e.target.value);
                        setSelectedAluno(aluno || null);
                      }}
                    >
                      <option value="">Selecione um aluno</option>
                      {alunos.map((aluno) => (
                        <option key={aluno.id} value={aluno.id}>
                          {aluno.nome} ({aluno.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAluno && (
                    <div>
                      <Label>Selecione a Turma</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        onChange={(e) => {
                          const turmaId = parseInt(e.target.value);
                          if (turmaId && selectedAluno) {
                            handleAtribuirTurma(selectedAluno.id, turmaId);
                          }
                        }}
                        disabled={isLoading}
                      >
                        <option value="">Selecione uma turma</option>
                        {turmas.map((turma) => (
                          <option key={turma.id} value={turma.id}>
                            {turma.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Dialog para listar alunos */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Listar Alunos</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lista de Alunos</DialogTitle>
              <DialogDescription>
                <div className="space-y-4 mt-4">
                  {alunos.map((aluno) => (
                    <div key={aluno.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{aluno.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {aluno.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Turma: {aluno.turmaId || "Não atribuída"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Dialog para criar novo aluno */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Criar Novo Aluno</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Aluno</DialogTitle>
              <DialogDescription>
                <AlunoForm onSuccess={fetchAlunos} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}

// Componente de formulário para criar aluno
function AlunoForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await api.post("/aluno", {
        nome: data.nome,
        email: data.email,
        // Outros campos necessários conforme o DTO
      });
      toast.success("Aluno criado com sucesso!");
      reset();
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      toast.error("Erro ao criar aluno");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <Label>Nome</Label>
        <Input {...register("nome")} required />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" {...register("email")} required />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar Aluno"}
      </Button>
    </form>
  );
}