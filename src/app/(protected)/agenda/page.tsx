"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useSession } from "next-auth/react";

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  dataEntrega: string;
  disciplina: string;
  turma?: {
    id: number;
    nome: string;
    disciplina: string;
    professor: string;
  };
  professor?: {
    id: number;
    nome: string;
  };
}

interface Turma {
  id: number;
  nome: string;
  disciplina: string;
}

interface Professor {
  id: number;
  nome: string;
  disciplina: string;
}

export default function Agenda() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasksForDate, setTasksForDate] = useState<Tarefa[]>([]);
  const [selectedTask, setSelectedTask] = useState<Tarefa | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [newTask, setNewTask] = useState({
    titulo: "",
    descricao: "",
    dataEntrega: "",
    disciplina: "",
    turmaId: "",
    professorId: session?.user.role === "PROFESSOR" ? session.user.id : "",
  });

  // Verifica se o usuário é professor ou coordenação
  const isProfessorOrCoordenacao = ["PROFESSOR", "COORDENACAO"].includes(
    session?.user.role ?? "ALUNO"
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/tarefa");
        setTasks(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        toast.error("Erro", {
          description: "Não foi possível carregar as tarefas",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTurmas = async () => {
      if (isProfessorOrCoordenacao) {
        try {
          const response = await api.get("/turma");
          setTurmas(response.data);
        } catch (error) {
          console.error("Erro ao carregar turmas:", error);
        }
      }
    };

    const fetchProfessores = async () => {
      if (session?.user.role === "COORDENACAO") {
        try {
          const response = await api.get("/professor");
          setProfessores(response.data);
        } catch (error) {
          console.error("Erro ao carregar professores:", error);
        }
      }
    };

    fetchTasks();
    fetchTurmas();
    fetchProfessores();
  }, [isProfessorOrCoordenacao, session]);

  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const parseBackendDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Corrige a diferença de 1 dia
    return date;
  };

  const formatBackendDate = (dateString: string) => {
    return format(parseBackendDate(dateString), "dd/MM/yyyy");
  };

  const isSameDay = (date1: Date, date2: Date) => {
    const normalizedDate1 = normalizeDate(date1);
    const normalizedDate2 = normalizeDate(date2);
    return normalizedDate1.getTime() === normalizedDate2.getTime();
  };

  const isDayWithTask = (date: Date) => {
    const normalizedDate = normalizeDate(date);
    return tasks.some((task) => {
      const taskDate = parseBackendDate(task.dataEntrega);
      return isSameDay(taskDate, normalizedDate);
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    const normalizedDate = date ? normalizeDate(date) : undefined;
    setSelectedDate(normalizedDate);

    if (normalizedDate) {
      const filtered = tasks.filter((task) => {
        const taskDate = parseBackendDate(task.dataEntrega);
        return isSameDay(taskDate, normalizedDate);
      });
      setTasksForDate(filtered);
    } else {
      setTasksForDate([]);
    }
  };

  const handleTaskClick = (task: Tarefa) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  const handleCreateTask = async () => {
    try {
      if (!newTask.titulo || !newTask.dataEntrega || !newTask.disciplina) {
        toast.error("Erro", {
          description: "Título, data de entrega e disciplina são obrigatórios",
        });
        return;
      }

      const response = await api.post("/tarefa", {
        titulo: newTask.titulo,
        descricao: newTask.descricao,
        dataEntrega: newTask.dataEntrega,
        disciplina: newTask.disciplina,
        turmaId: newTask.turmaId || null,
        professorId: newTask.professorId || session?.user.id,
      });

      setTasks([...tasks, response.data]);
      setIsCreateDialogOpen(false);
      setNewTask({
        titulo: "",
        descricao: "",
        dataEntrega: "",
        disciplina: "",
        turmaId: "",
        professorId: session?.user.role === "PROFESSOR" ? session.user.id : "",
      });
      toast.success("Tarefa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro", {
        description: "Não foi possível criar a tarefa",
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tarefa/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Tarefa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro", {
        description: "Não foi possível excluir a tarefa",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie suas atividades escolares e prazos
          </p>
        </div>

        {isProfessorOrCoordenacao && (
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)}>Criar Tarefa</Button>
            <Button variant="outline" onClick={() => setIsManageDialogOpen(true)}>
              Gerenciar Tarefas
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Tarefa</DialogTitle>
            <DialogDescription>Preencha os detalhes da nova tarefa</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Título*</Label>
              <Input
                value={newTask.titulo}
                onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                placeholder="Título da tarefa"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={newTask.descricao}
                onChange={(e) => setNewTask({ ...newTask, descricao: e.target.value })}
                placeholder="Descrição detalhada da tarefa"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data de Entrega*</Label>
                <Input
                  type="date"
                  value={newTask.dataEntrega}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dataEntrega: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Disciplina*</Label>
                <Input
                  value={newTask.disciplina}
                  onChange={(e) => setNewTask({ ...newTask, disciplina: e.target.value })}
                  placeholder="Nome da disciplina"
                />
              </div>
            </div>

            {session?.user.role === "COORDENACAO" && (
              <div>
                <Label>Professor*</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTask.professorId}
                  onChange={(e) =>
                    setNewTask({ ...newTask, professorId: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione um professor</option>
                  {professores.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {`${professor.nome} - ${professor.disciplina}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <Label>Turma (Opcional)</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newTask.turmaId}
                onChange={(e) => setNewTask({ ...newTask, turmaId: e.target.value })}
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome} - {turma.disciplina}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTask}>Criar Tarefa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para gerenciar tarefas */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Tarefas</DialogTitle>
            <DialogDescription>
              Visualize e gerencie todas as tarefas criadas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{task.titulo}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatBackendDate(task.dataEntrega)} -
                          {task.turma?.disciplina || "Sem disciplina"}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma tarefa encontrada
              </p>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsManageDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>Selecione uma data para ver as atividades</CardDescription>
          </CardHeader>
          <CardContent className="w-full flex items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={ptBR}
              className="rounded-md border"
              modifiers={{
                withTask: isDayWithTask,
              }}
              modifiersClassNames={{
                withTask: "bg-primary-foreground font-bold",
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Atividades</CardTitle>
            {selectedDate && (
              <CardDescription>
                Atividades para{" "}
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              tasksForDate.length > 0 ? (
                <div className="space-y-4">
                  {tasksForDate.map((task) => (
                    <div
                      key={task.id}
                      className="border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{task.titulo}</div>
                          <div className="flex items-center mt-1">
                            <span className="task-label">
                              {task.disciplina ||
                                task.turma?.disciplina ||
                                "Sem disciplina"}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {task.turma?.professor ||
                                task.professor?.id ||
                                "Professor não informado"}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatBackendDate(task.dataEntrega)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Não há atividades para esta data
                </p>
              )
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Selecione uma data no calendário
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{task.titulo}</h3>
                      <div className="flex items-center mt-1">
                        <span className="task-label">
                          {task.disciplina || task.turma?.disciplina || "Sem disciplina"}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {task.professor?.nome ||
                            task.turma?.professor ||
                            "Professor não informado"}
                        </span>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                        {task.descricao}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Prazo: {formatBackendDate(task.dataEntrega)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma tarefa encontrada
            </p>
          )}
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.titulo}</DialogTitle>
            <DialogDescription>
              {selectedTask?.professor?.nome ||
                selectedTask?.turma?.professor ||
                "Professor não informado"}{" "}
              •{" "}
              {selectedTask?.dataEntrega
                ? format(parseBackendDate(selectedTask.dataEntrega), "dd/MM/yyyy")
                : "Data não informada"}{" "}
              •{" "}
              {selectedTask?.disciplina ||
                selectedTask?.turma?.disciplina ||
                "Sem disciplina"}{" "}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Descrição</h3>
              <p className="text-sm">{selectedTask?.descricao}</p>
            </div>

            <div>
              <h3 className="font-medium mb-1">Data de Entrega</h3>
              <p className="text-sm">
                {selectedTask?.dataEntrega
                  ? format(parseBackendDate(selectedTask.dataEntrega), "dd/MM/yyyy")
                  : "Data não informada"}
              </p>
            </div>

            {selectedTask?.turma && (
              <div>
                <h3 className="font-medium mb-1">Turma</h3>
                <p className="text-sm">
                  {selectedTask.turma.nome} - {selectedTask.turma.disciplina}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsTaskDetailsOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
