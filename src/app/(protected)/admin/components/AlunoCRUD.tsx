import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

const alunoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome do aluno é obrigatório"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  turmaId: z.number().optional(),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
});

type AlunoFormValues = z.infer<typeof alunoSchema>;

export function AlunoCRUD() {
  const [alunos, setAlunos] = useState<AlunoFormValues[]>([]);
  const [turmas, setTurmas] = useState<{id: number, nome: string}[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AlunoFormValues>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      id: "",
      nome: "",
      dataNascimento: "",
      matricula: "",
      turmaId: undefined,
      email: "",
      senha: "",
    },
  });

  useEffect(() => {
    loadAlunos();
    loadTurmas();
  }, []);

  const loadAlunos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/aluno");
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTurmas = async () => {
    try {
      const response = await api.get("/turma");
      setTurmas(response.data);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  };

  const onSubmit = async (data: AlunoFormValues) => {
    setIsLoading(true);
    try {
      // Prepara o payload base
      const payload: {
        nome: string;
        dataNascimento: string;
        matricula: string;
        turmaId?: number;
        email: string;
        senha?: string | null;
      } = {
        nome: data.nome,
        dataNascimento: data.dataNascimento,
        matricula: data.matricula,
        email: data.email,
        senha: data.senha
      };

      // Adiciona turmaId se estiver definido
      if (data.turmaId) {
        payload.turmaId = data.turmaId;
      }

      // Adiciona senha apenas se estiver preenchida OU for criação
      if (data.senha && data.senha.length >= 6) {
        payload.senha = data.senha;
      }

      if (editingId) {
        await api.put(`/aluno/${editingId}`, payload);
        toast.success("Aluno atualizado com sucesso!");
      } else {
        await api.post("/aluno", { ...payload});
        toast.success("Aluno cadastrado com sucesso!");
      }

      await loadAlunos();
      resetForm();
    } catch (error: any) {
      console.error("Erro detalhado:", error.response?.data || error.message);
      toast.error("Erro", {
        description:
          error.response?.data?.message || "Ocorreu um erro ao salvar o aluno.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (aluno: AlunoFormValues) => {
    if (aluno.id) {
      form.reset({
        ...aluno,
        senha: "",
      });
      setEditingId(aluno.id);
      document.getElementById("form-aluno")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/aluno/${id}`);
      await loadAlunos();
      if (editingId === id) {
        resetForm();
      }
      toast("Sucesso", {
        description: "Aluno excluído com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao deletar aluno:", error);

      if (error.response?.status === 403) {
        toast.error("Erro", {
          description:
            "Não é possível excluir o aluno pois ele está matriculado em uma turma.",
        });
      } else {
        toast.error("Erro", {
          description: "Ocorreu um erro ao excluir o aluno.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      id: "",
      nome: "",
      dataNascimento: "",
      matricula: "",
      turmaId: undefined,
      email: "",
      senha: "",
    });
    setEditingId(null);
  };

  return (
    <div
      id="form-aluno"
      className="max-h-[80vh] overflow-y-auto p-4 border rounded-lg"
    >
      {/* Formulário */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4 border rounded-lg"
        >
          {editingId && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Editando ID: {editingId}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancelar Edição
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="Email do aluno" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento*</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula*</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de matrícula" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="turmaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turma</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      field.onChange(value);
                    }}
                  >
                    <option value="">Selecione uma turma</option>
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.nome}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!editingId && (
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha*</FormLabel>
                  <FormControl>
                    <Input placeholder="Mínimo 6 caracteres" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Processando..."
                : editingId
                ? "Atualizar Aluno"
                : "Cadastrar Aluno"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4 text-lg">Lista de Alunos</h3>

        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : alunos.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">Nenhum aluno cadastrado</p>
        ) : (
          <div className="space-y-3">
            {alunos.map((aluno) => (
              <div
                key={aluno.id}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{aluno.nome}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                    <span>Email: {aluno.email}</span>
                    <span>Matrícula: {aluno.matricula}</span>
                    <span>
                      Nascimento: {new Date(aluno.dataNascimento).toLocaleDateString()}
                    </span>
                    <span>
                      Turma: {aluno.turmaId ? 
                        turmas.find(t => t.id === aluno.turmaId)?.nome || aluno.turmaId 
                        : "Não matriculado"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(aluno)}
                    disabled={isLoading}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => aluno.id && handleDelete(aluno.id)}
                    disabled={isLoading}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}