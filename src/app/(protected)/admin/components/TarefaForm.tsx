import { Input } from "@/components/ui/input";
import api from '@/lib/axios';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(2).max(50),
  descricao: z.string().nullable(),
  dataEntrega: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),
  turma_id: z.string().min(1),
});

interface TarefaForms{
    isUpdate: boolean;
}

export function TarefaForm({isUpdate} :TarefaForms) {
  const [status, setStatus] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      titulo: "",
      descricao: "",
      dataEntrega: "",
      turma_id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.id) {
        // Atualizar tarefa
        const response = await api.put(`/tarefa/${values.id}`, values);
        console.log(response)
        setStatus("✅ Tarefa atualizada com sucesso!");
      } else {
        // Criar nova tarefa
        const response = await api.post("/tarefa", values);
        console.log(response);
        setStatus("✅ Tarefa criada com sucesso!");
        form.reset();
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Erro ao enviar dados para a API.");
    }
  }

  function formId(){
    return (
        <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarefa Id</FormLabel>
                <FormControl>
                  <Input placeholder="tarefa id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
    )
  }

  return (
    <div className="max-w-md mx-auto mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isUpdate ? formId() : null}

          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da tarefa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrição (opcional)"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataEntrega"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Entrega</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="turma_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID da Turma</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Enviar</Button>
        </form>
      </Form>

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
