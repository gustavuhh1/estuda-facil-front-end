"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "@/lib/axios"; // Importe sua instância do Axios

type User = {
  id: string;
  name: string;
};

type Message = {
  id: number;
  remetente: User;
  destinatario: User;
  respostaParaId: number | null;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  folder: "inbox" | "sent";
};

export default function MessagesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role; // 'ALUNO', 'PROFESSOR' ou 'ADMIN'

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<"inbox" | "sent">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    destinatarioId: "",
    destinatarioName: "",
    conteudo: "",
    respostaParaId: null as number | null,
  });
  const [users, setUsers] = useState<User[]>([]); // Para seleção de destinatários

  // Buscar usuários para seleção de destinatários
  useEffect(() => {
    if (userRole !== "ALUNO") {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("/professor");
          setUsers(response.data);
        } catch (error) {
          toast.error("Erro",{
            description: "Não foi possível carregar a lista de usuários"
          });
        }
      };
      fetchUsers();
    }
  }, [userRole]);

  // Buscar mensagens do backend
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        let response;

        if (selectedFolder === "inbox") {
          response = await axios.get(`/mensagens/recebidas?destinatarioId=${userId}`);
        } else {
          response = await axios.get(`/mensagens/enviadas?remetenteId=${userId}`);
        }

        setMessages(
          response.data.map((msg: any) => ({
            ...msg,
            folder: selectedFolder,
            dataEnvio: formatDate(msg.dataEnvio),
          }))
        );
      } catch (error) {
        toast.error("Erro",{
          description: "Não foi possível carregar as mensagens"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [userId, selectedFolder]);

  // Contar mensagens não lidas
  useEffect(() => {
    if (!userId || selectedFolder !== "inbox") return;

    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(`/mensagens/nao-lidas?responsavelId=${userId}`);
        console.log(`Mensagens não lidas: ${response.data}`);
      } catch (error) {
        console.error("Erro ao contar mensagens não lidas:", error);
      }
    };

    fetchUnreadCount();
  }, [userId, messages, selectedFolder]);

  const formatDate = (dateString: string) => {
    // Implemente sua lógica de formatação de data aqui
    return new Date(dateString).toLocaleString();
  };

  // Filtrar mensagens pela pasta selecionada
  const filteredMessages = messages.filter((msg) => msg.folder === selectedFolder);

  // Marcar mensagem como lida
  const markAsRead = async (id: number) => {
    try {
      await axios.put(`/mensagens/${id}/ler`);

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, lida: true } : msg))
      );
    } catch (error) {
      toast("Erro",{
        description: "Não foi possível marcar a mensagem como lida"
      });
    }
  };

  // Enviar nova mensagem
  const handleSendMessage = async () => {
    if (!newMessage.destinatarioId || !newMessage.conteudo) {
      toast("Erro",{
        description: "Preencha todos os campos obrigatórios"
      });
      return;
    }

    try {
      const mensagemDTO = {
        remetenteId: userId,
        destinatarioId: newMessage.destinatarioId,
        conteudo: newMessage.conteudo,
        respostaParaId: newMessage.respostaParaId,
      };

      const response = await axios.post("/mensagens", mensagemDTO);

      // Atualizar a lista de mensagens enviadas
      const sentMessage = {
        ...response.data,
        remetente: { id: userId, name: "Você" },
        destinatario: {
          id: newMessage.destinatarioId,
          name: newMessage.destinatarioName,
        },
        folder: "sent",
        dataEnvio: "Agora",
        lida: true,
      };

      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage({
        destinatarioId: "",
        destinatarioName: "",
        conteudo: "",
        respostaParaId: null,
      });
      setIsComposeOpen(false);

      toast("Sucesso",{
        description: "Mensagem enviada com sucesso"
      });
    } catch (error) {
      toast("Erro",{
        description: "Não foi possível enviar a mensagem"
      });
    }
  };

  // Responder a mensagem selecionada
  const handleReply = (message: Message) => {
    setNewMessage({
      destinatarioId: message.remetente.id,
      destinatarioName: message.remetente.name,
      conteudo: "",
      respostaParaId: message.id,
    });
    setSelectedMessage(null);
    setIsComposeOpen(true);
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
                    {messages.filter((m) => !m.lida && m.folder === "inbox").length}
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
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando mensagens...
                </div>
              ) : filteredMessages.length > 0 ? (
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        !message.lida ? "bg-secondary/50" : ""
                      }`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.lida) markAsRead(message.id);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {selectedFolder === "inbox"
                              ? `De: ${message.remetente.name}`
                              : `Para: ${message.destinatario.name}`}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {message.conteudo}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {message.dataEnvio}
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
              <DialogTitle>
                {selectedFolder === "inbox"
                  ? `De: ${selectedMessage.remetente.name}`
                  : `Para: ${selectedMessage.destinatario.name}`}
              </DialogTitle>
              <DialogDescription>{selectedMessage.dataEnvio}</DialogDescription>
            </DialogHeader>
            <div className="py-4 whitespace-pre-line">{selectedMessage.conteudo}</div>
            {selectedFolder === "inbox" && userRole !== "ALUNO" && (
              <DialogFooter>
                <Button onClick={() => handleReply(selectedMessage)}>Responder</Button>
              </DialogFooter>
            )}
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
                <Label htmlFor="destinatario">Destinatário</Label>
                <select
                  id="destinatario"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newMessage.destinatarioId}
                  onChange={(e) => {
                    const selectedUser = users.find((u) => u.id === e.target.value);
                    setNewMessage({
                      ...newMessage,
                      destinatarioId: e.target.value,
                      destinatarioName: selectedUser?.name || "",
                    });
                  }}
                >
                  <option value="">Selecione um destinatário</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="conteudo">Mensagem</Label>
                <Textarea
                  id="conteudo"
                  rows={5}
                  value={newMessage.conteudo}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, conteudo: e.target.value })
                  }
                />
              </div>
              {newMessage.respostaParaId && (
                <input type="hidden" value={newMessage.respostaParaId} />
              )}
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
