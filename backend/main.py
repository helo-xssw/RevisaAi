from fastapi import FastAPI
from database import engine, Base
from routers import auth

app = FastAPI()

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

# Inclui o router
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "API funcionando!"}
