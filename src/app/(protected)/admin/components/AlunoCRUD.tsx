import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import api from '@/lib/axios';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Schema de validação
const alunoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  dataNascimento: z.date({
    required_error: "Data de nascimento é obrigatória",
  }),
  matricula: z.string().min(2, "Matrícula deve ter pelo menos 2 caracteres"),
  turma_id: z.string().optional().nullable(),
  responsaveis: z.array(z.string()).optional(),
});

type AlunoFormValues = z.infer<typeof alunoSchema>;

export function AlunoCRUD() {
  const [alunos, setAlunos] = useState<AlunoFormValues[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [responsaveis, setResponsaveis] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AlunoFormValues>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      id: "",
      nome: "",
      dataNascimento: new Date(),
      matricula: "",
      turma_id: null,
      responsaveis: [],
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [alunosRes, turmasRes, responsaveisRes] = await Promise.all([
        api.get("/alunos"),
        api.get("/turmas"),
        api.get("/responsaveis")
      ]);
      setAlunos(alunosRes.data);
      setTurmas(turmasRes.data);
      setResponsaveis(responsaveisRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AlunoFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        dataNascimento: format(data.dataNascimento, 'yyyy-MM-dd'),
        turma_id: data.turma_id || null,
        responsaveis: data.responsaveis || []
      };

      if (editingId) {
        await api.put(`/alunos/${editingId}`, payload);
      } else {
        await api.post("/alunos", payload);
      }
      await loadData();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (aluno: any) => {
    if (aluno.id) {
      form.reset({
        ...aluno,
        dataNascimento: new Date(aluno.dataNascimento),
        turma_id: aluno.turma?.id?.toString() || null,
        responsaveis: aluno.responsaveis?.map((r: any) => r.id.toString()) || []
      });
      setEditingId(aluno.id);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/alunos/${id}`);
      await loadData();
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      id: "",
      nome: "",
      dataNascimento: new Date(),
      matricula: "",
      turma_id: null,
      responsaveis: [],
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
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
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
            name="dataNascimento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Nascimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="turma_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turma</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma turma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhuma turma</SelectItem>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id.toString()}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsaveis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsáveis</FormLabel>
                <Select
                  multiple
                  onValueChange={(values: any) => field.onChange(values)}
                  value={field.value || []}
                >
                  <FormControl>
                    <SelectTrigger className="min-h-[40px]">
                      <SelectValue placeholder="Selecione os responsáveis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {responsaveis.map((responsavel) => (
                      <SelectItem key={responsavel.id} value={responsavel.id.toString()}>
                        {responsavel.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : editingId ? "Atualizar Aluno" : "Cadastrar Aluno"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Lista de Alunos */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4 text-lg">Lista de Alunos</h3>
        
        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : alunos.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">Nenhum aluno cadastrado</p>
        ) : (
          <div className="space-y-3">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium">{aluno.nome}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                    <span>Matrícula: {aluno.matricula}</span>
                    <span>Nascimento: {format(new Date(aluno.dataNascimento), 'dd/MM/yyyy')}</span>
                    <span>Turma: {aluno.turma?.nome || "Nenhuma"}</span>
                    <span>
                      Responsáveis: {aluno.responsaveis?.map(r => r.nome).join(", ") || "Nenhum"}
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