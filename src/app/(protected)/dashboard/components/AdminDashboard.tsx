import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Baby, BookCheck, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Aluno, Professor, Tarefa, Turma } from "@/types";

interface DashboardData {
  tarefasAtivas: Tarefa[];
  professores: Professor[];
  alunos: Aluno[];
  turmas: Turma[];
}

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const tarefasResponse = await api.get("/tarefa");
        const professorResponse = await api.get("/professor");
        const AlunoResponse = await api.get("/aluno");
        const TurmaResponse = await api.get("/turma");

        const tarefasAtivas = tarefasResponse.data;
        const professores = professorResponse.data;
        const alunos = AlunoResponse.data;
        const turmas = TurmaResponse.data;
        console.log(turmas);

        setDashboardData({
          tarefasAtivas,
          professores,
          alunos,
          turmas,
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

  function calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();

    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();

    // Verifica se ainda não fez aniversário neste ano
    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && diaAtual < diaNascimento)
    ) {
      idade--;
    }

    return idade;
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!dashboardData) {
    return <div>Não foi possível carregar os dados</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Bem-vindo(a), {session?.user?.nome ?? ""}!
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-2">
          <CardHeader className="">
            <CardTitle className="text-lg">Alunos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.alunos.length}</div>
            <p className="text-xs text-muted-foreground"></p>
            <div className="mt-4">
              <Link
                href="/agenda"
                className="text-sm text-primary flex items-center hover:underline"
              >
                <Baby className="w-4 h-4 mr-1" />
                Ver todas os alunos
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader className="">
            <CardTitle className="text-lg">Professores Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.professores.length}</div>
            <p className="text-xs text-muted-foreground"></p>
            <div className="mt-4">
              <Link
                href="/agenda"
                className="text-sm text-primary flex items-center hover:underline"
              >
                <Users className="w-4 h-4 mr-1" />
                Ver todos professores
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader className="">
            <CardTitle className="text-lg">Atividades Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData.tarefasAtivas.length}</div>
            <p className="text-xs text-muted-foreground"></p>
            <div className="mt-4">
              <Link
                href="/agenda"
                className="text-sm text-primary flex items-center hover:underline"
              >
                <BookCheck className="w-4 h-4 mr-1" />
                Ver todas atividades
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lista Alunos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
            {dashboardData.alunos.length > 0 ? (
              dashboardData.alunos.map((aluno) => (
                <div
                  key={aluno.id}
                  className="border rounded-xl px-4 py-2 bg-muted hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex gap-2 items-baseline">
                        <p className="font-semibold">{aluno.nome}</p>
                        {"•"}
                        <span className="text-xs">
                          {calcularIdade(aluno.dataNascimento)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{aluno.email}</p>
                    </div>
                    {aluno.id && (
                      <span className="text-xs px-2 py-1 rounded bg-secondary">
                        {aluno.matricula}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista Professores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
            {dashboardData.professores.length > 0 ? (
              dashboardData.professores.map((professor) => (
                <div
                  key={professor.id}
                  className="border rounded-xl px-4 py-2 bg-muted hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex gap-2 items-baseline">
                        <p className="font-semibold">{professor.nome}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{professor.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {professor.telefone}
                      </p>
                    </div>
                    {professor.id && (
                      <span className="text-xs px-2 py-1 rounded bg-secondary-foreground">
                        {professor.disciplina}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista Turmas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
            {dashboardData.turmas.length > 0 ? (
              dashboardData.turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="border rounded-xl px-4 py-2 bg-muted hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex gap-2 items-baseline">
                        <p className="font-semibold">{turma.nome}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        codigo: {turma.codigo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ano letivo: {turma.anoLetivo}
                      </p>
                    </div>
                    {turma.id && (
                      <div>
                      <span className="text-xs px-2 py-1 rounded bg-secondary-foreground">
                        Alunos: {turma.alunos.length}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-secondary-foreground">
                        professores: {turma.professores.length}
                      </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
