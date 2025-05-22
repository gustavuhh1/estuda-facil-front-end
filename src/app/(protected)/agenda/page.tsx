"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTasks } from "@/lib/data";
import { Task } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Agenda(){
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasksForDate, setTasksForDate] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks); //

  // Filter tasks by status
  const pendingTasks = mockTasks.filter((task) => !task.completed);
  const completedTasks = mockTasks.filter((task) => task.completed);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    );

    // Atualizar tarefas para a data selecionada
    if (selectedDate) {
      const filtered = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          selectedDate.getDate() === taskDate.getDate() &&
          selectedDate.getMonth() === taskDate.getMonth() &&
          selectedDate.getFullYear() === taskDate.getFullYear()
        );
      });
      setTasksForDate(filtered);
    }

    setIsTaskDetailsOpen(false);
  };


  // Function to highlight dates with tasks
  const isDayWithTask = (date: Date) => {
    return mockTasks.some((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        date.getDate() === taskDate.getDate() &&
        date.getMonth() === taskDate.getMonth() &&
        date.getFullYear() === taskDate.getFullYear()
      );
    });
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (date) {
      const filtered = mockTasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          date.getDate() === taskDate.getDate() &&
          date.getMonth() === taskDate.getMonth() &&
          date.getFullYear() === taskDate.getFullYear()
        );
      });
      setTasksForDate(filtered);
    } else {
      setTasksForDate([]);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground">
          Gerencie suas atividades escolares e prazos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>Selecione uma data para ver as atividades</CardDescription>
          </CardHeader>
          <CardContent>
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
                withTask: "bg-primary/20 font-bold text-primary",
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
                          <div className="font-medium">{task.title}</div>
                          <div className="flex items-center mt-1">
                            <span className={`task-label task-label-${task.subject}`}>
                              {task.subject}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {task.teacherName}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm">
                          {task.completed ? (
                            <span className="bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
                              Concluída
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 rounded px-2 py-1 text-xs">
                              Pendente
                            </span>
                          )}
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
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pendentes ({pendingTasks.length})</TabsTrigger>
              <TabsTrigger value="completed">
                Concluídas ({completedTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingTasks.length > 0 ? (
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`task-label task-label-${task.subject}`}>
                              {task.subject}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {task.teacherName}
                            </span>
                          </div>
                          <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Prazo: {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Não há atividades pendentes
                </p>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedTasks.length > 0 ? (
                <div className="space-y-4">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border rounded-lg p-4 hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`task-label task-label-${task.subject}`}>
                              {task.subject}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {task.teacherName}
                            </span>
                          </div>
                          <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Concluída em:{" "}
                          {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Não há atividades concluídas
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>
              {selectedTask?.teacherName} •{" "}
              {new Date(selectedTask?.dueDate || "").toLocaleDateString("pt-BR")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="flex items-center">
                <span className={`task-label task-label-${selectedTask?.subject}`}>
                  {selectedTask?.subject}
                </span>
                {selectedTask?.completed ? (
                  <span className="bg-green-100 text-green-800 rounded px-2 py-1 text-xs ml-2">
                    Concluída
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 rounded px-2 py-1 text-xs ml-2">
                    Pendente
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Descrição</h3>
              <p className="text-sm">{selectedTask?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Data de Lançamento</h3>
                <p className="text-sm">
                  {new Date(selectedTask?.createdAt || "").toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Data de Entrega</h3>
                <p className="text-sm">
                  {new Date(selectedTask?.dueDate || "").toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsTaskDetailsOpen(false)}>
              Fechar
            </Button>
            <Button
              onClick={() => selectedTask && toggleTaskCompletion(selectedTask.id)}
              variant={selectedTask?.completed ? "outline" : "default"}
            >
              {selectedTask?.completed ? "Marcar como Pendente" : "Marcar como Concluída"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
