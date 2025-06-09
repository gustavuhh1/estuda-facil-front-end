// types/auth.ts

export interface Usuario {
  id: string;
  email: string;
  role: "ALUNO" | "PROFESSOR" | "COORDENACAO"; // ou use enum se quiser
  nome: string;
  dataNascimento: string | Date | null;
  matricula?: string;
  turmaId?: number;
  disciplina: string | null;
  telefoneContato: string | null;
  departamento?: string | null;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
