from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import jwt
import uuid
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

import schemas
import models
from database import engine, pegar_db
from agent import agente
from ai_tools import token_auth

# Inicializa as tabelas
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kanban To-Do API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

SECRET_KEY = "sua_chave_secreta_super_aleatoria_aqui"
ALGORITHM = "HS256"

# --- UTILITÁRIOS DE SEGURANÇA ---

def gerar_token_sessao():
    usuario_id = str(uuid.uuid4())
    payload = {
        "sub": usuario_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=365)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def obter_usuario_logado(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token ausente")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada")

# --- ROTAS DE SESSÃO E CHAT ---

@app.get("/gerar-sessao")
def nova_sessao():
    return {"token": gerar_token_sessao()}

class ChatRequest(BaseModel):
    mensagem: str

@app.post("/chat")
def conversar_com_ia(
    request: ChatRequest, 
    db: Session = Depends(pegar_db), 
    usuario_id: str = Depends(obter_usuario_logado),
    authorization: str = Header(None) # 🎯 1. Captura o Token que veio do React
):
    try:
        # 🎯 2. Dá o "Crachá VIP" para a IA usar nas tools
        if authorization:
            token_auth.set(authorization)

        db.add(models.MensagemChat(usuario_id=usuario_id, role="user", texto=request.mensagem))
        
        resultado = agente.invoke(
            {"messages": [("user", request.mensagem)]}, 
            config={"configurable": {"thread_id": usuario_id}}
        )
        
        resposta_ia = str(resultado["messages"][-1].content)
        
        db.add(models.MensagemChat(usuario_id=usuario_id, role="ia", texto=resposta_ia))
        
        db.commit()
        return {"resposta": resposta_ia}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chat/historico")
def obter_historico(db: Session = Depends(pegar_db), usuario_id: str = Depends(obter_usuario_logado)):
    return db.query(models.MensagemChat)\
             .filter(models.MensagemChat.usuario_id == usuario_id)\
             .order_by(models.MensagemChat.criado_em.asc()).all()

# --- CRUD DE TAREFAS (COM ISOLAMENTO) ---

@app.get("/tarefas", response_model=List[schemas.Tarefa])
def listar_tarefas(db: Session = Depends(pegar_db), usuario_id: str = Depends(obter_usuario_logado)):
    return db.query(models.Tarefa).filter(models.Tarefa.usuario_id == usuario_id).all()

@app.post("/tarefas", response_model=schemas.Tarefa)
def criar_tarefa(tarefa: schemas.CriarTarefa, db: Session = Depends(pegar_db), usuario_id: str = Depends(obter_usuario_logado)):
    nova_tarefa = models.Tarefa(**tarefa.dict(exclude={"tags"}), usuario_id=usuario_id)
    
    if tarefa.tags:
        for nome_tag in tarefa.tags:
            tag_db = db.query(models.Tag).filter(models.Tag.nome == nome_tag, models.Tag.usuario_id == usuario_id).first()
            if not tag_db:
                tag_db = models.Tag(nome=nome_tag, usuario_id=usuario_id)
            nova_tarefa.tags.append(tag_db)

    db.add(nova_tarefa)
    db.commit()
    db.refresh(nova_tarefa)
    return nova_tarefa

@app.put("/tarefas/{tarefa_id}", response_model=schemas.Tarefa)
def atualizar_tarefa(tarefa_id: int, tarefa_upd: schemas.AtualizarTarefa, db: Session = Depends(pegar_db), usuario_id: str = Depends(obter_usuario_logado)):
    tarefa_db = db.query(models.Tarefa).filter(models.Tarefa.id == tarefa_id, models.Tarefa.usuario_id == usuario_id).first()
    if not tarefa_db: raise HTTPException(status_code=404, detail="Não encontrado")
    
    dados = tarefa_upd.dict(exclude_unset=True, exclude={"tags"})
    for key, value in dados.items(): setattr(tarefa_db, key, value)

    if tarefa_upd.tags is not None:
        tarefa_db.tags = []
        for nome_tag in tarefa_upd.tags:
            tag_db = db.query(models.Tag).filter(models.Tag.nome == nome_tag, models.Tag.usuario_id == usuario_id).first()
            if not tag_db: tag_db = models.Tag(nome=nome_tag, usuario_id=usuario_id)
            tarefa_db.tags.append(tag_db)

    db.commit()
    db.refresh(tarefa_db)
    return tarefa_db

@app.delete("/tarefas/{tarefa_id}")
def deletar_tarefa(tarefa_id: int, db: Session = Depends(pegar_db), usuario_id: str = Depends(obter_usuario_logado)):
    tarefa_db = db.query(models.Tarefa).filter(models.Tarefa.id == tarefa_id, models.Tarefa.usuario_id == usuario_id).first()
    if not tarefa_db: raise HTTPException(status_code=404, detail="Não encontrado")
    db.delete(tarefa_db)
    db.commit()
    return {"status": "Sucesso"}