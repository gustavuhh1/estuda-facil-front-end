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

const professorSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome do professor é obrigatório"),
  disciplina: z.string().min(1, "Disciplina é obrigatória"),
  telefoneContato: z
    .string()
    .min(8, "Telefone deve ter pelo menos 8 dígitos")
    .max(20)
    .optional(),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
});

type ProfessorFormValues = z.infer<typeof professorSchema>;

export function ProfessorCRUD() {
  const [professores, setProfessores] = useState<ProfessorFormValues[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfessorFormValues>({
    resolver: zodResolver(professorSchema),
    defaultValues: {
      id: "",
      nome: "",
      disciplina: "",
      telefoneContato: "",
      email: "",
      senha: "",
    },
  });

  useEffect(() => {
    loadProfessores();
  }, []);

  const loadProfessores = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/professor");
      setProfessores(response.data);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfessorFormValues) => {
    setIsLoading(true);
    try {
      console.log("Dados do formulário:", data);
      console.log("Editando ID:", editingId);

      // Prepara o payload base
      const payload: {
        nome: string;
        disciplina: string;
        telefoneContato: string | null;
        email: string;
        senha?: string;
      } = {
        nome: data.nome,
        disciplina: data.disciplina,
        telefoneContato: data.telefoneContato || null, // Envia null se estiver vazio
        email: data.email,
      };

      // Adiciona senha apenas se estiver preenchida OU for criação
      if (data.senha && data.senha.length >= 6) {
        payload.senha = data.senha;
      }

      if (editingId) {
        console.log("Enviando PUT para:", `/professor/${editingId}`);
        console.log("Payload:", payload);
        await api.put(`/professor/${editingId}`, payload);
        toast.success("Professor atualizado com sucesso!");
      } else {
        console.log("Enviando POST para:", "/professor");
        console.log("Payload:", { ...payload, role: "PROFESSOR" });
        await api.post("/professor", { ...payload, role: "PROFESSOR" });
        toast.success("Professor cadastrado com sucesso!");
      }

      await loadProfessores();
      resetForm();
    } catch (error: any) {
      console.error("Erro detalhado:", error.response?.data || error.message);
      toast.error("Erro", {
        description:
          error.response?.data?.message || "Ocorreu um erro ao salvar o professor.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (professor: ProfessorFormValues) => {
    console.log("Editando professor:", professor);
    if (professor.id) {
      form.reset({
        ...professor,
        senha: "",
      });
      setEditingId(professor.id);
      document.getElementById("form-professor")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/professor/${id}`);
      await loadProfessores();
      if (editingId === id) {
        resetForm();
      }
      toast("Sucesso", {
        description: "Professor excluído com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao deletar professor:", error);

      if (error.response?.status === 403) {
        toast.error("Erro", {
          description:
            "Não é possível excluir o professor pois ele está alocado em uma turma.",
        });
      } else {
        toast.error("Erro", {
          description: "Ocorreu um erro ao excluir o professor.",
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
      disciplina: "",
      telefoneContato: "",
      email: "",
      senha: "",
    });
    setEditingId(null);
  };

  return (
    <div
      id="form-professor"
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
                    <Input placeholder="Email do professor" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="disciplina"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disciplina*</FormLabel>
                  <FormControl>
                    <Input placeholder="Disciplina lecionada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefoneContato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(00) 00000-0000"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                ? "Atualizar Professor"
                : "Cadastrar Professor"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4 text-lg">Lista de Professores</h3>

        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : professores.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">Nenhum professor cadastrado</p>
        ) : (
          <div className="space-y-3">
            {professores.map((professor) => (
              <div
                key={professor.id}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{professor.nome}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                    <span>Email: {professor.email}</span>
                    <span>Disciplina: {professor.disciplina}</span>
                    <span>Telefone: {professor.telefoneContato || "Não informado"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(professor)}
                    disabled={isLoading}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => professor.id && handleDelete(professor.id)}
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
