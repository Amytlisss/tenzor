export const database = {
  today: { day: 22, month: 9, year: 2026 }, // Октябрь 2026
  slots: {
    '2026-10-22': [
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '12:00', available: true },
      { time: '13:00', available: true },
      { time: '14:00', available: false }, // Занят
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true },
      { time: '18:00', available: false }, // Занят
    ],
    '2026-10-23': [
      { time: '12:00', available: true },
      { time: '13:00', available: true },
      { time: '14:00', available: true },
    ],
    '2026-10-24': [
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '12:00', available: true },
      { time: '13:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true },
      { time: '18:00', available: true },
    ]
  }
};