import requests
from langchain_core.tools import tool
from typing import Union

API_BASE_URL = "http://localhost:8000"

#Funcao auxiliar
def buscar_id_por_nome(nome_busca: str) -> Union[int, str]:
    """
    Função auxiliar para buscar o ID de uma tarefa pelo nome.
    Retorna o ID (int) se encontrar apenas uma, ou uma mensagem de erro (str).
    """
    try:
        resposta = requests.get(f"{API_BASE_URL}/tarefas")
        if resposta.status_code != 200:
            return "Erro ao acessar o banco de dados para buscar tarefas."
        
        tarefas = resposta.json()
        encontradas = [t for t in tarefas if nome_busca.lower() in t["titulo"].lower()]

        if not encontradas:
            return f"Nenhuma tarefa encontrada com o nome '{nome_busca}'."
        
        if len(encontradas) > 1:
            ids_nomes = [f"ID {t['id']} ({t['titulo']})" for t in encontradas]
            return f"Encontrei várias tarefas parecidas: {', '.join(ids_nomes)}. Por favor, especifique o ID."

        return encontradas[0]["id"]
    except Exception as e:
        return f"Erro na comunicação com a API: {str(e)}"
    


# Criar tarefa
@tool
def criar_tarefa_tool(titulo: str, desc: str = None, status: str = "A_FAZER", data_limite: str = None) -> str:
      """
            Cria uma nova tarefa no quadro Kanban.
            Sempre use esta ferramenta quando o usuário pedir para criar, adicionar ou agendar uma nova tarefa. (Basicamente fazer uma nova tarefa surgir)
            O status padrão deve ser "A_FAZER" a menos que o usuário especifique outro.
      """
      tarefa_payload = {
            "titulo": titulo,
            "desc": desc,
            "status": status,
            "data_limite": data_limite
      }

      resposta = requests.post(f"{API_BASE_URL}/tarefas", json=tarefa_payload)

      if resposta.status_code == 200:
            dados = resposta.json()
            return f"Sucesso! Tarefa '{dados['titulo']}' criada com ID {dados['id']}."
      else:
            return f"Erro ao criar tarefa: {resposta.text}"

# Atualizar tarefa
@tool
def atualizar_tarefa_tool(
    nome_tarefa_busca: str = None, 
    tarefa_id: int = None, 
    novo_titulo: str = None, 
    novo_desc: str = None, 
    novo_status: str = None, 
    nova_data_limite: str = None
) -> str:
      """
            Atualiza uma tarefa existente no quadro Kanban.
            Para encontrar a tarefa, você DEVE fornecer o 'tarefa_id' OU o 'nome_tarefa_busca'.
            Se fornecer o 'nome_tarefa_busca', a ferramenta vai buscar o ID automaticamente.
            Os campos com prefixo 'novo_' são os dados que serão alterados na tarefa.
      """

      if not tarefa_id and not nome_tarefa_busca:
            return "Erro: Você precisa fornecer o 'tarefa_id' ou o 'nome_tarefa_busca' para eu encontrar o card."
      
      if not tarefa_id:
            resultado = buscar_id_por_nome(nome_tarefa_busca)
            if isinstance(resultado, str): return resultado
            tarefa_id = resultado

      tarefa_payload = {k: v for k, v in {
            "titulo": novo_titulo, "desc": novo_desc, 
            "status": novo_status, "data_limite": nova_data_limite
      }.items() if v is not None}

      if not tarefa_payload:
            return f"A tarefa '{nome_tarefa_busca or tarefa_id}' foi encontrada, mas você não informou nenhum dado novo para atualizar."
      
      resposta = requests.put(f"{API_BASE_URL}/tarefas/{tarefa_id}", json=tarefa_payload)

      if resposta.status_code == 200:
            return f"Sucesso! Tarefa {tarefa_id} atualizada com os dados: {tarefa_payload}"
      else:
            return f"Erro ao atualizar tarefa: {resposta.text}"
      
@tool
def deletar_tarefa_tool(nome_tarefa_busca: str = None, tarefa_id: int = None) -> str:
      """Deleta uma tarefa. Forneça 'tarefa_id' ou 'nome_tarefa_busca'."""
      if not tarefa_id and not nome_tarefa_busca:
           return "Erro: Forneça o 'tarefa_id' ou o 'nome_tarefa_busca'."
      
      if not tarefa_id:
           resultado = buscar_id_por_nome(nome_tarefa_busca)
           if isinstance(resultado, str): return resultado
           tarefa_id = resultado
      
      resposta = requests.delete(f"{API_BASE_URL}/tarefas/{tarefa_id}")
      return f"Tarefa {tarefa_id} excluída com sucesso." if resposta.status_code == 200 else f"Erro: {resposta.text}"
