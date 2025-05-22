export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  class?: string;
}

export interface Tarefa {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  createdAt: string;
  completed?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}
