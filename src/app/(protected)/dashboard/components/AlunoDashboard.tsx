import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface Tarefa {
  id: number;
  titulo: string;
  dataEntrega: string;
  descricao: string;
  turma?: {
    nome: string;
    professor: string;
    disciplina: string;
  };
}

interface DashboardData {
  tarefasPendentes: Tarefa[];
}

export function AlunoDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const tarefasResponse = await api.get("/tarefa");
        const tarefasPendentes = tarefasResponse.data;

        setDashboardData({
          tarefasPendentes,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        toast.error("Erro", {
          description: "Não foi possível carregar os dados do dashboard",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const parseDate = (dateString: string) => {
    try {
      return new Date(dateString);
    } catch {
      return new Date(NaN);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!dashboardData) {
    return <div>Não foi possível carregar os dados</div>;
  }

  // Próxima entrega (pega a primeira tarefa)
  const nextDelivery = dashboardData.tarefasPendentes[0];
  const nextDeliveryDate = nextDelivery ? parseDate(nextDelivery.dataEntrega) : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Bem-vindo(a), {session?.user?.nome ?? ""}!
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-2">
          <CardHeader className="">
            <CardTitle className="text-lg">Atividades Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.tarefasPendentes.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.tarefasPendentes.length === 1
                ? "atividade não concluída"
                : "atividades não concluídas"}
            </p>
            <div className="mt-4">
              <Link
                href="/agenda"
                className="text-sm text-primary flex items-center hover:underline"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Ver todas as atividades
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">***</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">sla</div>
            <p className="text-xs text-muted-foreground">mensagem nova</p>
            <div className="mt-4">
              <Link
                href="/mensagens"
                className="text-sm text-primary flex items-center hover:underline"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Ver todas as mensagens
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Próxima entrega</CardTitle>
          </CardHeader>
          <CardContent>
            {nextDelivery ? (
              <>
                <div className="space-y-1">
                  <h3 className="font-medium">{nextDelivery.titulo}</h3>
                  <div className="flex items-center">
                    <span
                      className={`subject-badge subject-${
                        nextDelivery.turma?.disciplina || "outro"
                      }`}
                    >
                      {nextDelivery.turma?.disciplina || "Sem disciplina"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vence{" "}
                    {nextDeliveryDate
                      ? formatDistanceToNow(nextDeliveryDate, {
                          locale: ptBR,
                          addSuffix: true,
                        })
                      : "Data inválida"}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/agenda"
                    className="text-sm text-primary flex items-center hover:underline"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Ver todas as tarefas
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Não há entregas próximas</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.tarefasPendentes.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.tarefasPendentes.slice(0, 3).map((task) => {
                  const taskDate = parseDate(task.dataEntrega);
                  const formattedDate = isNaN(taskDate.getTime())
                    ? task.dataEntrega
                    : format(taskDate, "dd/MM/yyyy");

                  return (
                    <div key={task.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{task.titulo}</div>
                          <div className="flex items-center mt-1">
                            <span
                              className={`subject-badge subject-${
                                task.turma?.disciplina || "outro"
                              }`}
                            >
                              {task.turma?.disciplina || "Sem disciplina"}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {task.turma?.professor || "Professor não informado"}
                            </span>
                          </div>
                          <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                            {task.descricao}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Não há atividades pendentes!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens Recentes</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
}
