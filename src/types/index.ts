export interface User {
  id: string;
  name: string;
  email: string;
  role: "ALUNO" | "PROFESSOR" | "COORDENACAO";
  class?: string;
}

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  dataEntrega: string;
  disciplina: string;
  turmaId: number;
  professorId: string;
}

export interface Turma {
  id: number;
  codigo: string;
  nome: string;
  anoLetivo: string;
  alunos: Aluno[];
  professores: Professor[];
}

export interface Aluno {
  id: string;
  email: string;
  nome: string;
  matricula: string;
  turmaId: number;
  dataNascimento: string;
}
export interface Professor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  disciplina: string;
}
