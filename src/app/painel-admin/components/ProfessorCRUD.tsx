import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import api from '@/lib/axios';

const professorSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  discipline: z.string().min(2, "Disciplina deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(8, "Telefone deve ter pelo menos 8 dígitos").max(20).nullable(),
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
      discipline: "",
      telefone: "",
    }
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
      if (editingId) {
        await api.put(`/professor/${editingId}`, { ...data, id: editingId });
      } else {
        await api.post("/professor", data);
      }
      await loadProfessores();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (professor: ProfessorFormValues) => {
    if (professor.id) {
      form.reset({
        ...professor,
        id: professor.id, 
      });
      setEditingId(professor.id);
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
    } catch (error) {
      console.error("Erro ao deletar professor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      id: "",
      nome: "",
      discipline: "",
      telefone: "",
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      {/* Formulário */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
          {editingId && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Editando ID: {editingId}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetForm}
              >
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
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discipline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disciplina</FormLabel>
                  <FormControl>
                    <Input placeholder="Disciplina lecionada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : editingId ? "Atualizar Professor" : "Cadastrar Professor"}
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
              <div key={professor.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium">{professor.nome}</p>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span>Disciplina: {professor.discipline}</span>
                    <span>Telefone: {professor.telefone || "Não informado"}</span>
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