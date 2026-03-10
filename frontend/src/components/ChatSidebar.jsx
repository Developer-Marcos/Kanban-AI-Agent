// src/components/ChatSidebar.jsx
import { useTranslation } from 'react-i18next'; // 🎯 Nova importação
import { MensagemIA, MensagemUsuario } from './MensagensChat';

export function ChatSidebar() {
  const { t, i18n } = useTranslation(); // 🎯 Hook de tradução

  // Função para alternar entre PT e EN
  const toggleLanguage = () => {
    const novoIdioma = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(novoIdioma);
  };
  
  const handleEnviar = (e) => {
    e.preventDefault();
    console.log("Mensagem enviada para a IA! 🚀");
  };

  return (
    <aside className="w-[400px] bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-3xl flex flex-col overflow-hidden">
      
      {/* ==========================================
           Topo do Chat (Cabeçalho Estilizado)
           ========================================== */}
      {/* 🎯 MUDANÇA: 'justify-between' para empurrar o botão para a direita */}
      <div className="p-4 border-b border-black/20 flex items-center justify-between gap-3 shrink-0 bg-white/10 backdrop-blur-md">
          
          <div className="flex items-center gap-3">
            {/* Avatar da IA com Animação de Respiração */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400/80 via-purple-400/80 to-teal-300/80 flex items-center justify-center border border-black/20 shadow-sm shrink-0 animate-breathe">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.527 2.527l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.527 2.527l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.527-2.527l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Nome e Status */}
            <div className="flex flex-col">
              <h2 className="text-gray-800 font-bold text-sm tracking-wide">
                {t('assistente_kanban', 'Assistente Kanban')}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                </div>
                <span className="text-gray-600 text-xs font-medium tracking-wide">
                  {t('status', 'Sempre online')}
                </span>
              </div>
            </div>
          </div>

          {/* 🎯 NOVO BOTÃO DE TRADUÇÃO (Área Circulada) */}
          <button 
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10 text-[10px] font-bold uppercase transition-all border border-black/10 text-gray-700 shadow-sm shrink-0"
          >
            {i18n.language === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
          </button>

      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
      
      <MensagemIA texto={t('boas_vindas')} />
      <MensagemUsuario texto={t('msg_usuario_ex')} />
      <MensagemIA texto={t('msg_ia_resp_ex')} />

      </div>

      {/* Área de Input */}
      <div className="p-4 shrink-0 mb-2">
        <form onSubmit={handleEnviar} className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder={t('placeholder', 'Mande um comando...')} 
            className="flex-1 h-12 px-5 bg-white/20 backdrop-blur-md border border-black/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-600 text-gray-800 shadow-sm text-sm transition-all"
          />
          <button 
            type="submit" 
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-400/80 via-purple-400/80 to-teal-300/80 backdrop-blur-sm border border-black/30 hover:opacity-80 hover:scale-105 text-white rounded-2xl transition-all shadow-md shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -mr-0.5 drop-shadow-sm">
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </form>
        <div className="h-1 w-1/3 mx-auto bg-black/10 rounded-full mt-4"></div>
      </div>

    </aside>
  )
}