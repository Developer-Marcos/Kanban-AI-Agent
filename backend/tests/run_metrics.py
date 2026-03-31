import pytest
import requests
import json
import time
import jwt
import sys
import os
from dotenv import load_dotenv

load_dotenv()

caminho_backend = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, caminho_backend)

from database import SessaoLocal
from models import Tarefa

caminho_dataset = os.path.join(os.path.dirname(__file__), 'eval_dataset.json')
with open(caminho_dataset, 'r', encoding='utf-8') as f:
    dataset = json.load(f)

@pytest.fixture(scope="module")
def sessao_teste():
    """Gera token e limpa TUDO no final."""
    resp_sessao = requests.get("http://localhost:8000/gerar-sessao")
    token = resp_sessao.json()["token"]
    payload = jwt.decode(token, options={"verify_signature": False})
    usuario_id = payload["sub"]
    
    yield {"token": token, "usuario_id": usuario_id}
    
    db = SessaoLocal()
    db.query(Tarefa).filter(Tarefa.usuario_id == usuario_id).delete()
    db.commit()
    db.close()
    print("\n Setup finalizado: Banco limpo e usuário removido.")

def preparar_cenario_db(db, usuario_id, prompt):
    """
    Injeta a tarefa exata que o prompt vai tentar manipular.
    Isso garante que a busca da IA sempre retorne um resultado.
    """
    prompt_lower = prompt.lower()
    tarefas_para_injetar = []
    
    mapeamento = {
        "documentar a api": "documentar a API",
        "reunião de alinhamento": "reunião de alinhamento",
        "refatorar código": "Refatorar código",
        "corrigir o erro 500": "corrigir o erro 500",
        "criar repo": "Criar repo",
        "sync com o time de design": "sync com o time de design",
        "tarefa de login": "Tarefa de login",
        "concluídas": "Tarefa Antiga Concluída"
    }

    for termo, titulo_real in mapeamento.items():
        if termo in prompt_lower:
            existe = db.query(Tarefa).filter(Tarefa.usuario_id == usuario_id, Tarefa.titulo == titulo_real).first()
            if not existe:
                status_inicial = "FEITO" if termo == "concluídas" else "A_FAZER"
                tarefas_para_injetar.append(Tarefa(usuario_id=usuario_id, titulo=titulo_real, status=status_inicial))

    if tarefas_para_injetar:
        db.add_all(tarefas_para_injetar)
        db.commit()

@pytest.mark.parametrize("caso_de_teste", dataset)
def test_agente_deve_executar_operacao_correta(caso_de_teste, sessao_teste):
    prompt = caso_de_teste["input"]
    intent_esperada = caso_de_teste["expected_intent"]
    args_esperados = caso_de_teste.get("expected_args", {})
    usuario_id = sessao_teste["usuario_id"]
    headers = {"Authorization": f"Bearer {sessao_teste['token']}"}
    
    db = SessaoLocal()
    preparar_cenario_db(db, usuario_id, prompt)
    qtd_antes = db.query(Tarefa).filter(Tarefa.usuario_id == usuario_id).count()
    db.close()

    resposta = requests.post("http://localhost:8000/chat", json={"mensagem": prompt}, headers=headers)
    assert resposta.status_code == 200, f"Erro na API: {resposta.status_code}"
    
    time.sleep(4)
    
    db = SessaoLocal()
    tarefas_depois = db.query(Tarefa).filter(Tarefa.usuario_id == usuario_id).all()
    qtd_depois = len(tarefas_depois)
    
    if intent_esperada == "INSERT":
        assert qtd_depois > qtd_antes, f"FALHA INSERT: IA não criou a tarefa para: '{prompt}'"
        if "status_expected" in args_esperados:
            assert tarefas_depois[-1].status.value == args_esperados["status_expected"]
            
    elif intent_esperada == "UPDATE":
        if "status_expected" in args_esperados:
            status_correto = any(t.status.value == args_esperados["status_expected"] for t in tarefas_depois)
            assert status_correto, f"FALHA UPDATE: IA não alterou o status para: '{prompt}'"

    elif intent_esperada == "DELETE":
        assert qtd_depois < qtd_antes, f"FALHA DELETE: IA não apagou a tarefa para: '{prompt}'"

    elif intent_esperada in ["SELECT", "NONE"]:
        assert qtd_depois == qtd_antes, "FALHA: Ação de leitura alterou o banco indevidamente."

    elif intent_esperada == "MULTIPLE":
        assert abs(qtd_depois - qtd_antes) >= 1, "FALHA MULTIPLE: Nenhuma alteração detectada."

    db.close()
