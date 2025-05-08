"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string | null;
  dataEntrega: string;
  turma_id: string;
};

export function TarefaList() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetchTarefas();
  }, []);

  async function fetchTarefas() {
    try {
      const response = await api.get<Tarefa[]>("/tarefa");
      setTarefas(response.data);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar as tarefas.");
    }
  }

  async function deletarTarefa(id: string) {
    try {
      await api.delete(`/tarefa/${id}`);
      // Remove a tarefa da lista local
      setTarefas((tarefasAntigas) => tarefasAntigas.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      setErro("Não foi possível deletar a tarefa.");
    }
  }

  if (erro) return <p className="text-red-500">{erro}</p>;

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-bold">Lista de Tarefas</h2>
      {tarefas.length === 0 ? (
        <p>Não há tarefas cadastradas.</p>
      ) : (
        <ul className="space-y-2">
          {tarefas.map((tarefa) => (
            <li key={tarefa.id} className="border p-3 rounded bg-gray-50">
              <strong>{`${tarefa.titulo}  id: ${tarefa.id}`}</strong>
              <p>{tarefa.descricao || "Sem descrição"}</p>
              <p>Entrega: {new Date(tarefa.dataEntrega).toLocaleDateString()}</p>
              <p>Turma ID: {tarefa.turma_id}</p>
              <button
                onClick={() => deletarTarefa(tarefa.id)}
                className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Deletar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
