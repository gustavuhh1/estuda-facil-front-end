"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, Send, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Message = {
  id: string;
  sender: string;
  content: string;
  date: string;
  isRead: boolean;
  folder: "inbox" | "sent";
};

export default function MessagesPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role; // 'student', 'teacher' ou 'admin'

  // Estado das mensagens
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Prof. Ana Paula",
      content: "A aula de Matemática de amanhã será no laboratório de informática.",
      date: "há 1 hora",
      isRead: false,
      folder: "inbox",
    },
    {
      id: "2",
      sender: "Diretora Marcela M",
      content:
        "Informamos que no próximo dia 27/05/2025 não haverá aula devido à Reunião Pedagógica dos professores.",
      date: "há 1 dia",
      isRead: true,
      folder: "inbox",
    },
    {
      id: "3",
      sender: "Prof. Renato Augusto",
      content:
        "Lembrem-se que as atividades de Geografia devem ser entregues até quinta-feira.",
      date: "há 2 dias",
      isRead: true,
      folder: "inbox",
    },
  ]);

  const [selectedFolder, setSelectedFolder] = useState<"inbox" | "sent">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    content: "",
  });

  // Filtrar mensagens pela pasta selecionada
  const filteredMessages = messages.filter((msg) => msg.folder === selectedFolder);

  // Marcar mensagem como lida
  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  // Enviar nova mensagem
  const handleSendMessage = () => {
    if (!newMessage.recipient || !newMessage.content) return;

    const sentMessage: Message = {
      id: Date.now().toString(),
      sender: "Você",
      content: newMessage.content,
      date: "agora",
      isRead: true,
      folder: "sent",
    };

    setMessages((prev) => [...prev, sentMessage]);
    setNewMessage({ recipient: "", subject: "", content: "" });
    setIsComposeOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
        <p className="text-muted-foreground">Comunicados e avisos da escola</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              {userRole !== "ALUNO" && (
                <Button className="w-full" onClick={() => setIsComposeOpen(true)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Nova Mensagem
                </Button>
              )}

              <div className="space-y-1 mt-4">
                <Button
                  variant={selectedFolder === "inbox" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder("inbox")}
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  Caixa de Entrada
                  <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                    {messages.filter((m) => !m.isRead && m.folder === "inbox").length}
                  </span>
                </Button>

                <Button
                  variant={selectedFolder === "sent" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder("sent")}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviadas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de mensagens */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedFolder === "inbox" ? "Caixa de Entrada" : "Mensagens Enviadas"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredMessages.length > 0 ? (
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        !message.isRead ? "bg-secondary/50" : ""
                      }`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.isRead) markAsRead(message.id);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{message.sender}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {message.content}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {message.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedFolder === "inbox"
                    ? "Nenhuma mensagem na caixa de entrada"
                    : "Nenhuma mensagem enviada"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo de visualização de mensagem */}
      {selectedMessage && (
        <Dialog
          open={!!selectedMessage}
          onOpenChange={(open) => !open && setSelectedMessage(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedMessage.sender}</DialogTitle>
              <DialogDescription>{selectedMessage.date}</DialogDescription>
            </DialogHeader>
            <div className="py-4 whitespace-pre-line">{selectedMessage.content}</div>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de nova mensagem (apenas para professores/admins) */}
      {userRole !== "ALUNO" && (
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Mensagem</DialogTitle>
              <DialogDescription>
                Envie um comunicado para alunos ou outros professores
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Destinatário</Label>
                <Input
                  id="recipient"
                  placeholder="Turma, Aluno ou Professor"
                  value={newMessage.recipient}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, recipient: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  placeholder="Assunto da mensagem"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="content">Mensagem</Label>
                <Textarea
                  id="content"
                  rows={5}
                  value={newMessage.content}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, content: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendMessage}>Enviar Mensagem</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
