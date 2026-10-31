from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List


#   МОДЕЛИ ДАННЫХ  

class Category(BaseModel):
    id: int
    name: str
    servicesCount: int


#   МОКОВЫЕ ДАННЫЕ  

categories: List[Category] = [
    Category(id=1, name="Стрижки и укладки", servicesCount=5),
    Category(id=2, name="Маникюр и педикюр", servicesCount=5),
    Category(id=3, name="Брови и ресницы", servicesCount=4),
    Category(id=4, name="Спа-процедуры", servicesCount=4),
]


#   ПРИЛОЖЕНИЕ FASTAPI  

app = FastAPI(title="Beauty Salon API")


#   ЗАДАНИЕ 1. СПИСОК ВСЕХ КАТЕГОРИЙ  

@app.get("/categories", response_model=List[Category])
def get_categories():
    """
    Возвращает список всех категорий услуг с количеством услуг в каждой.
    """
    return categories


#   ЗАДАНИЕ 2. ИНФОРМАЦИЯ ПО КОНКРЕТНОЙ КАТЕГОРИИ  

@app.get("/categories/{category_id}", response_model=Category)
def get_category(category_id: int):
    """
    Возвращает информацию о конкретной категории услуг по её ID.
    Если категория не найдена — возвращает ошибку 404.
    """
    for category in categories:
        if category.id == category_id:
            return category
    
    # Категория не найдена
    raise HTTPException(status_code=404, detail="Сategory not found")


#   ЗАПУСК  

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)