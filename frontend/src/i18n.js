// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    pt: {
      translation: {
        "assistente_kanban": "Assistente Kanban",
        "status": "Sempre online",
        "placeholder": "Mande um comando...",
        "coluna_fazer": "A Fazer",
        "coluna_andamento": "Em Andamento",
        "coluna_concluido": "Concluído",
        "boas_vindas": "Olá! Eu sou o seu Assistente de Tarefas. O que vamos organizar hoje?",
        // 🎯 Novas chaves para o exemplo:
        "msg_usuario_ex": "Preciso organizar as minhas tarefas pendentes da faculdade.",
        "msg_ia_resp_ex": "Perfeito! Vou buscar suas anotações mais recentes e criar os cards para você. Um momento..."
      }
    },
    en: {
      translation: {
        "assistente_kanban": "Kanban Assistant",
        "status": "Always online",
        "placeholder": "Send a command...",
        "coluna_fazer": "To Do",
        "coluna_andamento": "In Progress",
        "coluna_concluido": "Done",
        "boas_vindas": "Hello! I am your Task Assistant. What shall we organize today?",
        // 🎯 Novas chaves para o exemplo (Inglês padrão):
        "msg_usuario_ex": "I need to organize my pending college tasks.",
        "msg_ia_resp_ex": "Perfect! I'll look for your most recent notes and create the cards for you. Just a moment..."
      }
    }
  },
  lng: "en", // 🎯 AGORA O PADRÃO É INGLÊS
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;