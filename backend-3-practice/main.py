from fastapi import FastAPI, HTTPException, Query, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel, ConfigDict
from typing import List, Optional

#   БАЗА ДАННЫХ  

DATABASE_URL = "sqlite:///./salon.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


#   ЗАДАНИЕ 1. МОДЕЛЬ MASTER  

class Master(Base):
    __tablename__ = "masters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)


# Создаём таблицу при запуске
Base.metadata.create_all(bind=engine)


#   PYDANTIC-СХЕМЫ ДЛЯ ОТВЕТОВ  

class MasterResponse(BaseModel):
    id: int
    name: str
    specialization: str

    model_config = ConfigDict(from_attributes=True)


#   ЗАПОЛНЕНИЕ БД ТЕСТОВЫМИ ДАННЫМИ  

def seed_data():
    """Заполняет таблицу начальными данными, если она пуста."""
    db = SessionLocal()
    try:
        if db.query(Master).count() == 0:
            db.add_all([
                Master(id=1, name="Анна", specialization="Парикмахер"),
                Master(id=2, name="Мария", specialization="Визажист"),
                Master(id=3, name="Елена", specialization="Парикмахер"),
                Master(id=4, name="Ольга", specialization="Маникюр"),
            ])
            db.commit()
    finally:
        db.close()


seed_data()


#   ПРИЛОЖЕНИЕ FASTAPI  

app = FastAPI(title="Beauty Salon API — Masters")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#   ЗАДАНИЕ 2. API  

@app.get("/masters", response_model=List[MasterResponse])
def get_masters(
    specialization: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Получить список всех мастеров.
    Если передан параметр specialization — вернуть только мастеров этой специализации.
    """
    query = db.query(Master)
    if specialization is not None:
        query = query.filter(Master.specialization == specialization)
    return query.all()


@app.get("/masters/{master_id}", response_model=MasterResponse)
def get_master(master_id: int, db: Session = Depends(get_db)):
    """
    Получить одного мастера по его id.
    Если мастер не найден — вернуть 404.
    """
    master = db.query(Master).filter(Master.id == master_id).first()
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master


#   ЗАПУСК  

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)