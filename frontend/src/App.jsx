// src/App.jsx
import './App.css'
import { useTranslation } from 'react-i18next'; // 🎯 Nova importação
import { ColunaKanban, CardEsqueleto } from './components/ColunaKanban'
import { ChatSidebar } from './components/ChatSidebar'

function App() {
  const { t } = useTranslation(); // 🎯 Inicializamos a tradução

  return (
    // Fundo da tela: Trocamos o gradiente estático pela classe animada customizada
    <div className="h-screen w-full fundo-animado-diagonal flex p-6 gap-6 font-sans box-border overflow-hidden">
      
      <main className="flex-1 bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-3xl p-6 flex flex-col overflow-hidden">
        
        {/* Grid com as 3 Colunas */}
        <div className="flex-1 grid grid-cols-3 gap-6 min-h-0">
          
          <ColunaKanban titulo={t('coluna_fazer')}>
            <CardEsqueleto altura="h-32" />
            <CardEsqueleto altura="h-28" />
            <CardEsqueleto altura="h-36" />
          </ColunaKanban>

          <ColunaKanban titulo={t('coluna_andamento')}>
            <CardEsqueleto altura="h-40" />
          </ColunaKanban>

          <ColunaKanban titulo={t('coluna_concluido')}>
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