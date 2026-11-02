from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel, Field, ConfigDict
from typing import List

#   БАЗА ДАННЫХ  

DATABASE_URL = "sqlite:///./salon.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


#   SQLALCHEMY-МОДЕЛИ  

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    servicesCount = Column(Integer, default=0)


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    categoryId = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    desc = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)  # в минутах
    price = Column(Float, nullable=False)


# Создаём таблицы при запуске
Base.metadata.create_all(bind=engine)


#   PYDANTIC-МОДЕЛИ  

class CategoryResponse(BaseModel):
    id: int
    name: str
    servicesCount: int

    model_config = ConfigDict(from_attributes=True)


# Задание 1: Pydantic-модель ServiceCreate с валидацией
class ServiceCreate(BaseModel):
    categoryId: int = Field(..., description="Идентификатор категории")
    title: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Название услуги (не пустое, макс 100 символов)"
    )
    desc: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Описание услуги (не пустое, макс 100 символов)"
    )
    duration: int = Field(
        ...,
        ge=30,
        le=180,
        description="Продолжительность в минутах (от 30 до 180)"
    )
    price: float = Field(
        ...,
        gt=0,
        description="Стоимость услуги (должна быть больше 0)"
    )


class ServiceResponse(BaseModel):
    id: int
    categoryId: int
    title: str
    desc: str
    duration: int
    price: float

    model_config = ConfigDict(from_attributes=True)


#   ЗАПОЛНЕНИЕ БД ТЕСТОВЫМИ ДАННЫМИ  

def seed_data():
    """Заполняет таблицу категорий начальными данными, если она пуста."""
    db = SessionLocal()
    try:
        if db.query(Category).count() == 0:
            db.add_all([
                Category(id=1, name="Стрижки и укладки", servicesCount=5),
                Category(id=2, name="Маникюр и педикюр", servicesCount=5),
                Category(id=3, name="Брови и ресницы", servicesCount=4),
                Category(id=4, name="Спа-процедуры", servicesCount=4),
            ])
            db.commit()
    finally:
        db.close()


seed_data()


#   ПРИЛОЖЕНИЕ FASTAPI  

app = FastAPI(title="Beauty Salon API — Services")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#   ЭНДПОИНТЫ  

@app.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Получить список всех категорий."""
    return db.query(Category).all()


@app.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Получить одну категорию по ID."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


# Задание 2: POST /services
@app.post("/services", status_code=201, response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    """
    Создать новую услугу.
    Pydantic автоматически валидирует данные и вернёт 422 при ошибках.
    При успешном создании возвращает код 201.
    """
    # Проверяем, что категория существует
    category = db.query(Category).filter(Category.id == service.categoryId).first()
    if category is None:
        raise HTTPException(
            status_code=404,
            detail=f"Category with id {service.categoryId} not found"
        )

    # Создаём услугу в БД
    db_service = Service(
        categoryId=service.categoryId,
        title=service.title,
        desc=service.desc,
        duration=service.duration,
        price=service.price,
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)

    # Увеличиваем счётчик услуг в категории
    category.servicesCount += 1
    db.commit()

    return db_service


@app.get("/services", response_model=List[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    """Получить список всех услуг."""
    return db.query(Service).all()


@app.get("/services/{service_id}", response_model=ServiceResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    """Получить одну услугу по ID."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


#   ЗАПУСК  

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)