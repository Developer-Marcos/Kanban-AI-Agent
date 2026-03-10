import './App.css' // Importante garantir que o CSS está importado
import { ColunaKanban, CardEsqueleto } from './components/ColunaKanban'
import { ChatSidebar } from './components/ChatSidebar'

function App() {
  return (
    // Fundo da tela: Trocamos o gradiente estático pela classe animada customizada
    // Mantemos 'h-screen w-full flex p-6...' para a estrutura
    <div className="h-screen w-full fundo-animado-diagonal flex p-6 gap-6 font-sans box-border overflow-hidden">
      
      {/* ==========================================
          LADO ESQUERDO: ÁREA DO KANBAN
          ========================================== */}
      <main className="flex-1 bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-3xl p-6 flex flex-col overflow-hidden">
        
        {/* Grid com as 3 Colunas */}
        <div className="flex-1 grid grid-cols-3 gap-6 min-h-0">
          
          <ColunaKanban titulo="A Fazer">
            <CardEsqueleto altura="h-32" />
            <CardEsqueleto altura="h-28" />
            <CardEsqueleto altura="h-36" />
          </ColunaKanban>

          <ColunaKanban titulo="Em Andamento">
            <CardEsqueleto altura="h-40" />
          </ColunaKanban>

          <ColunaKanban titulo="Concluído">
            <CardEsqueleto altura="h-28" />
            <CardEsqueleto altura="h-32" />
          </ColunaKanban>

        </div>
      </main>

      <ChatSidebar />

    </div>
  )
}

export default App