"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  // TODO: Substituir por chamada à API
  // const { data: dashboardData, isLoading } = api.dashboard.getData.useQuery();

  // Função para parsear datas em diferentes formatos
  const parseDate = (dateString: string) => {
    try {
      // Tenta parsear no formato "ddmmyyyy" (23052025)
      if (/^\d{8}$/.test(dateString)) {
        return parse(dateString, "ddMMyyyy", new Date());
      }
      // Tenta parsear no formato "dd/MM/yyyy" (24/05/2025)
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return parse(dateString, "dd/MM/yyyy", new Date());
      }
      // Se não reconhecer o formato, retorna data inválida
      return new Date(NaN);
    } catch {
      return new Date(NaN);
    }
  };

  // Dados mockados (remover quando conectar ao backend)
  const dashboardData = {
    user: {
      name: "Gustavo Martins",
    },
    stats: {
      pendingActivities: 3,
      unreadMessages: 2,
    },
    recentActivities: [
      {
        id: 1,
        title: "Atividade Geografia",
        date: "23052025", // 23/05/2025
        subject: "geografia",
        teacher: "Prof. Renato Augusto",
        description:
          "Estudar os nomes dos continentes e oceanos do mundo (páginas 12 a 15 do livro).",
      },
      {
        id: 2,
        title: "Atividade Matemática",
        date: "24/05/2025",
        subject: "matemática",
        teacher: "Prof. Ana Paula",
        description: "Resolver os exercícios de álgebra (páginas 45 a 47).",
      },
      {
        id: 3,
        title: "Atividade Redação",
        date: "25/05/2025",
        subject: "redacao",
        teacher: "Prof. Pedro Cabral",
        description: "Escrever uma redação dissertativa sobre meio ambiente.",
      },
    ],
    recentMessages: [
      {
        id: 1,
        sender: "Prof. Renato Augusto",
        content:
          "Lembrem-se que as atividades de Geografia devem ser entregues até quinta-feira.",
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        read: true,
      },
      {
        id: 2,
        sender: "Diretora Marcela M",
        content:
          "Informamos que no próximo dia 27/05/2025 não haverá aula devido à Reunião Pedagógica dos professores.",
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
        read: false,
      },
      {
        id: 3,
        sender: "Prof. Ana Paula",
        content: "A aula de Matemática de amanhã será no laboratório de informática.",
        sentAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 horas atrás
        read: false,
      },
    ],
  };

  // Próxima entrega (pega a primeira atividade)
  const nextDelivery = dashboardData.recentActivities[0];
  const nextDeliveryDate = parseDate(nextDelivery.date);

  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Bem-vindo(a), {session?.user.nome ?? ""}!
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-2">
          <CardHeader className="">
            <CardTitle className="text-lg">Atividades Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardData.stats.pendingActivities}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.stats.pendingActivities === 1
                ? "atividade não concluída"
                : "atividades não concluídas"}
            </p>
            <div className="mt-4">
              <Link
                href="/calendar"
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
            <CardTitle className="text-lg">Mensagens não lidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.stats.unreadMessages === 1
                ? "mensagem nova"
                : "mensagens novas"}
            </p>
            <div className="mt-4">
              <Link
                href="/messages"
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
            {dashboardData.stats.pendingActivities > 0 ? (
              <>
                <div className="space-y-1">
                  <h3 className="font-medium">{nextDelivery.title}</h3>
                  <div className="flex items-center">
                    <span className={`subject-badge subject-${nextDelivery.subject}`}>
                      {nextDelivery.subject}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vence{" "}
                    {formatDistanceToNow(nextDeliveryDate, {
                      locale: ptBR,
                      addSuffix: true,
                    })}
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
            {dashboardData.stats.pendingActivities > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivities.map((task) => {
                  const taskDate = parseDate(task.date);
                  const formattedDate = isNaN(taskDate.getTime())
                    ? task.date // Se não conseguir parsear, mostra o valor original
                    : format(taskDate, "dd/MM/yyyy");

                  return (
                    <div key={task.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="flex items-center mt-1">
                            <span className={`subject-badge subject-${task.subject}`}>
                              {task.subject}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {task.teacher}
                            </span>
                          </div>
                          <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                            {task.description}
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
          <CardContent>
            {dashboardData.recentMessages.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentMessages.map((message) => (
                  <div key={message.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{message.sender}</span>
                          {!message.read && (
                            <span className="inline-block h-2 w-2 bg-primary rounded-full ml-2"></span>
                          )}
                        </div>
                        <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                          {message.content}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(message.sentAt, {
                            locale: ptBR,
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma mensagem recente</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
