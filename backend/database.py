from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
      raise ValueError("Variável de ambiente DATABASE_URL não foi configurada!")

engine = create_engine(
      SQLALCHEMY_DATABASE_URL,
      pool_pre_ping=True,  
      pool_size=5,         
      max_overflow=10      
)

SessaoLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def pegar_db():
      db = SessaoLocal()
      try:
            yield db
      finally:
            db.close()