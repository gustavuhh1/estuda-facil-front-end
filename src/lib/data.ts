import { Task, Message } from "@/types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Atividade Geografia",
    description:
      "Estudar os nomes dos continentes e oceanos do mundo (páginas 12 a 15 do livro).",
    subject: "geografia",
    teacherId: "2",
    teacherName: "Prof. Renato Augusto",
    dueDate: "2025-05-24",
    createdAt: "2025-05-11",
  },
  {
    id: "2",
    title: "Atividade Matemática",
    description: "Resolver os exercícios de álgebra (páginas 45 a 47).",
    subject: "matematica",
    teacherId: "4",
    teacherName: "Prof. Ana Paula",
    dueDate: "2025-05-25",
    createdAt: "2025-05-12",
  },
  {
    id: "3",
    title: "Atividade Redação",
    description: "Escrever uma redação dissertativa sobre meio ambiente.",
    subject: "redacao",
    teacherId: "5",
    teacherName: "Prof. Pedro Cabral",
    dueDate: "2025-05-26",
    createdAt: "2025-05-14",
  },
  {
    id: "4",
    title: "Atividade Geografia",
    description: "Pesquisa sobre os principais rios da América do Sul.",
    subject: "geografia",
    teacherId: "2",
    teacherName: "Prof. Renato Augusto",
    dueDate: "2025-05-28",
    createdAt: "2025-05-15",
    completed: true,
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "2",
    senderName: "Prof. Renato Augusto",
    content:
      "Lembrem-se que as atividades de Geografia devem ser entregues até quinta-feira.",
    timestamp: "2025-05-20T10:30:00",
    read: true,
  },
  {
    id: "2",
    senderId: "3",
    senderName: "Diretora Marcela M",
    content:
      "Informamos que no próximo dia 27/05/2025 não haverá aula devido à Reunião Pedagógica dos professores. As atividades voltam normalmente no dia seguinte. Solicitamos que os alunos entreguem todas as atividades antes do recesso. Para dúvidas, entrar em contato pelo e-mail: secretaria@estudafacil.edu.br",
    timestamp: "2025-05-21T09:15:00",
    read: false,
  },
  {
    id: "3",
    senderId: "4",
    senderName: "Prof. Ana Paula",
    content: "A aula de Matemática de amanhã será no laboratório de informática.",
    timestamp: "2025-05-21T14:25:00",
    read: false,
  },
];
