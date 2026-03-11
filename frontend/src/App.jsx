import { useState, useEffect, useCallback } from 'react'; 
import './App.css'
import { useTranslation } from 'react-i18next';
import { ColunaKanban, CardTarefa } from './components/ColunaKanban'
import { ChatSidebar } from './components/ChatSidebar'
import { DndContext, DragOverlay } from '@dnd-kit/core';

function App() {
  const { t } = useTranslation();
  const [tarefas, setTarefas] = useState([]);
  const [sessionReady, setSessionReady] = useState(false);
  const [tarefaAtiva, setTarefaAtiva] = useState(null); 

  const inicializarSessao = useCallback(async () => {
    try {
      let token = localStorage.getItem('kanban_token');
      
      if (!token) {
        console.log("Gerando nova sessão...");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/gerar-sessao`);
        const data = await response.json();
        localStorage.setItem('kanban_token', data.token);
      }
      
      setSessionReady(true);
    } catch (error) {
      console.error("Erro ao inicializar sessão:", error);
    }
  }, []);

  const carregarTarefas = useCallback(async () => {
    const token = localStorage.getItem('kanban_token');
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tarefas`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('kanban_token');
        setSessionReady(false);
        inicializarSessao();
        return;
      }

      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error("Erro na busca de tarefas:", error);
    }
  }, [inicializarSessao]);

  useEffect(() => {
    if (!sessionReady) {
      inicializarSessao();
    } else {
      carregarTarefas();
    }
  }, [sessionReady, inicializarSessao, carregarTarefas]);

  const handleDragStart = (event) => {
    const { active } = event;
    const tarefaClicada = tarefas.find(t => t.id === parseInt(active.id));
    setTarefaAtiva(tarefaClicada); 
  };

  const handleDragEnd = async (event) => {
    setTarefaAtiva(null); 

    const { active, over } = event;

    if (!over) return;

    const tarefaId = parseInt(active.id); 
    const novoStatus = over.id; 

    const tarefaAtual = tarefas.find(t => t.id === tarefaId);
    if (!tarefaAtual || tarefaAtual.status === novoStatus) return;

    setTarefas(prevTarefas => 
      prevTarefas.map(t => 
        t.id === tarefaId ? { ...t, status: novoStatus } : t
      )
    );

    const token = localStorage.getItem('kanban_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tarefas/${tarefaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: novoStatus }) 
      });

      if (!response.ok) throw new Error("Falha ao salvar o novo status no banco de dados.");
      
    } catch (error) {
      console.error("Erro ao mover a tarefa:", error);
      carregarTarefas(); 
    }
  };

  return (
    <div className="h-screen w-full fundo-animado-diagonal flex p-6 gap-6 font-sans box-border overflow-hidden">
      
      <main className="flex-1 bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-3xl p-6 flex flex-col overflow-hidden">
        
        <DndContext 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setTarefaAtiva(null)} 
        >
          <div className="flex-1 grid grid-cols-3 gap-6 min-h-0">
            
            <ColunaKanban id="A_FAZER" titulo={t('coluna_fazer')}>
              {tarefas
                  .filter(t => t.status === 'A_FAZER')
                  .map(tarefa => <CardTarefa key={tarefa.id} tarefa={tarefa} />)
              }
            </ColunaKanban>

            <ColunaKanban id="EM_PROGRESSO" titulo={t('coluna_andamento')}>
              {tarefas
                  .filter(t => t.status === 'EM_PROGRESSO')
                  .map(tarefa => <CardTarefa key={tarefa.id} tarefa={tarefa} />)
              }
            </ColunaKanban>

            <ColunaKanban id="FEITO" titulo={t('coluna_concluido')}>
              {tarefas
                  .filter(t => t.status === 'FEITO')
                  .map(tarefa => <CardTarefa key={tarefa.id} tarefa={tarefa} />)
              }
            </ColunaKanban>

          </div>

          <DragOverlay>
            {tarefaAtiva ? <CardTarefa tarefa={tarefaAtiva} isOverlay={true} /> : null}
          </DragOverlay>

        </DndContext>
      </main>

      <ChatSidebar aoAtualizarBanco={carregarTarefas} pronto={sessionReady} />

    </div>
  )
}

export default App