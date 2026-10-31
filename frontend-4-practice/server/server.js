import { database } from './database.js';

const DELAY_MS = 800; // Задержка для имитации сети

export function setupServer(app) {
  // Эндпоинт /api/booking/today
  app.use(async (req, res, next) => {
    if (req.url === '/api/booking/today') {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(database.today));
      return;
    }

    // Эндпоинт /api/slots?day=&month=&year=
    if (req.url.startsWith('/api/slots')) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      
      // Парсим query параметры из URL
      const url = new URL(req.url, 'http://localhost:3000');
      const day = url.searchParams.get('day');
      const month = url.searchParams.get('month');
      const year = url.searchParams.get('year');

      const m = String(Number(month) + 1).padStart(2, '0');
      const d = String(day).padStart(2, '0');
      const dateKey = `${year}-${m}-${d}`;

      const slots = database.slots[dateKey] || [];
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        date: dateKey,
        slots: slots
      }));
      return;
    }

    // Если это не наш API эндпоинт, передаём управление дальше
    next();
  });
}