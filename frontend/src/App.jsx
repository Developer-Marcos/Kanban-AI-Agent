import { useState, useEffect, useCallback } from 'react'; 
import './App.css'
import { useTranslation } from 'react-i18next';
import { ColunaKanban, CardTarefa } from './components/ColunaKanban'
import { ChatSidebar } from './components/ChatSidebar'

function App() {
  const { t } = useTranslation();
  const [tarefas, setTarefas] = useState([]);
  const [sessionReady, setSessionReady] = useState(false); // 🎯 Novo: Controle de prontidão do token

  // 1. Função para garantir que o usuário tenha um "Passaporte" (Token)
  const inicializarSessao = useCallback(async () => {
    try {
      let token = localStorage.getItem('kanban_token');
      
      if (!token) {
        console.log("Gerando nova sessão...");
        const response = await fetch('http://localhost:8000/gerar-sessao');
        const data = await response.json();
        localStorage.setItem('kanban_token', data.token);
      }
      
      setSessionReady(true); // Autoriza o carregamento das tarefas
    } catch (error) {
      console.error("Erro ao inicializar sessão:", error);
    }
  }, []);

  // 2. Função para buscar tarefas usando o Token no Header
  const carregarTarefas = useCallback(async () => {
    const token = localStorage.getItem('kanban_token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/tarefas', {
        headers: {
          'Authorization': `Bearer ${token}` // 🎯 O "carimbo" de segurança
        }
      });

      if (response.status === 401) {
        // Token inválido/expirado? Reseta e tenta de novo
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

  // Efeito inicial: Primeiro a sessão, depois os dados
  useEffect(() => {
    if (!sessionReady) {
      inicializarSessao();
    } else {
      carregarTarefas();
    }
  }, [sessionReady, inicializarSessao, carregarTarefas]);

  return (
    <div className="h-screen w-full fundo-animado-diagonal flex p-6 gap-6 font-sans box-border overflow-hidden">
      
      <main className="flex-1 bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-3xl p-6 flex flex-col overflow-hidden">
        
        <div className="flex-1 grid grid-cols-3 gap-6 min-h-0">
          
          {/* Coluna: A Fazer */}
          <ColunaKanban titulo={t('coluna_fazer')}>
            {tarefas
                .filter(t => t.status === 'A_FAZER')
                .map(tarefa => <CardTarefa key={tarefa.id} tarefa={tarefa} />)
            }
          </ColunaKanban>

          {/* Coluna: Em Andamento */}
          <ColunaKanban titulo={t('coluna_andamento')}>
            {tarefas
                .filter(t => t.status === 'EM_PROGRESSO')
                .map(tarefa => <CardTarefa key={tarefa.id} tarefa={tarefa} />)
            }
          </ColunaKanban>

          {/* Coluna: Concluído */}
          <ColunaKanban titulo={t('coluna_concluido')}>
            {tarefas
                .filter(t => t.status === 'FEITO')
                .map(tarefa => <CardTarefa key={tarefa.id} tarefa={tarefa} />)
            }
          </ColunaKanban>

        </div>
      </main>

      {/* Passamos o sessionReady para a Sidebar saber se pode enviar mensagens */}
      <ChatSidebar aoAtualizarBanco={carregarTarefas} pronto={sessionReady} />

    </div>
  )
}

export default App