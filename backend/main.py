from fastapi import FastAPI
from database import engine, Base
from routers import auth, motos

app = FastAPI()

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

# Inclui os routers
app.include_router(auth.router)
app.include_router(motos.router)

@app.get("/")
def root():
    return {"message": "API funcionando!"}
