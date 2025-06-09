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

const turmaSchema = z.object({
  id: z.string().optional(),
  codigo: z.string().min(1, "Código da turma é obrigatório"),
  nome: z.string().min(1, "Nome da turma é obrigatório"),
  anoLetivo: z.string().min(1, "Ano letivo é obrigatório"),
});

type TurmaFormValues = z.infer<typeof turmaSchema>;

export function TurmaCRUD() {
  const [turmas, setTurmas] = useState<TurmaFormValues[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TurmaFormValues>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      id: "",
      codigo: "",
      nome: "",
      anoLetivo: "",
    },
  });

  useEffect(() => {
    loadTurmas();
  }, []);

  const loadTurmas = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/turma");
      setTurmas(response.data);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TurmaFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        codigo: data.codigo,
        nome: data.nome,
        anoLetivo: data.anoLetivo,
      };

      if (editingId) {
        await api.put(`/turma/${editingId}`, payload);
        toast.success("Turma atualizada com sucesso!");
      } else {
        await api.post("/turma", payload);
        toast.success("Turma cadastrada com sucesso!");
      }

      await loadTurmas();
      resetForm();
    } catch (error: any) {
      console.error("Erro detalhado:", error.response?.data || error.message);
      toast.error("Erro", {
        description:
          error.response?.data?.message || "Ocorreu um erro ao salvar a turma.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (turma: TurmaFormValues) => {
    if (turma.id) {
      form.reset(turma);
      setEditingId(turma.id);
      document.getElementById("form-turma")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/turma/${id}`);
      await loadTurmas();
      if (editingId === id) {
        resetForm();
      }
      toast("Sucesso", {
        description: "Turma excluída com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao deletar turma:", error);

      if (error.response?.status === 403) {
        toast.error("Erro", {
          description:
            "Não é possível excluir a turma pois ela possui alunos matriculados.",
        });
      } else {
        toast.error("Erro", {
          description: "Ocorreu um erro ao excluir a turma.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      id: "",
      codigo: "",
      nome: "",
      anoLetivo: "",
    });
    setEditingId(null);
  };

  return (
    <div
      id="form-turma"
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
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código*</FormLabel>
                  <FormControl>
                    <Input placeholder="Código da turma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da turma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="anoLetivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano Letivo*</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit">
              {isLoading
                ? "Processando..."
                : editingId
                ? "Atualizar Turma"
                : "Cadastrar Turma"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4 text-lg">Lista de Turmas</h3>

        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : turmas.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">Nenhuma turma cadastrada</p>
        ) : (
          <div className="space-y-3">
            {turmas.map((turma) => (
              <div
                key={turma.id}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{turma.nome}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                    <span>Código: {turma.codigo}</span>
                    <span>Ano Letivo: {turma.anoLetivo}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(turma)}
                    disabled={isLoading}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => turma.id && handleDelete(turma.id)}
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