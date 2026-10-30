export const SLOTS_DATA = {
  '2026-10-22': [
    { time: '10:00', busy: false }, { time: '11:00', busy: false }, { time: '12:00', busy: false },
    { time: '13:00', busy: false }, { time: '14:00', busy: true }, { time: '15:00', busy: false },
    { time: '16:00', busy: false }, { time: '17:00', busy: false }, { time: '18:00', busy: true },
  ],
  '2026-10-23': [
    { time: '12:00', busy: false }, { time: '13:00', busy: false }, { time: '14:00', busy: false },
  ],
  '2026-10-24': [
    { time: '10:00', busy: false }, { time: '11:00', busy: false }, { time: '12:00', busy: false },
    { time: '13:00', busy: false }, { time: '14:00', busy: false }, { time: '15:00', busy: false },
    { time: '16:00', busy: false }, { time: '17:00', busy: false }, { time: '18:00', busy: false },
  ]
};

export const DEFAULT_SLOTS = [
  { time: '10:00', busy: false }, { time: '11:00', busy: false }, { time: '12:00', busy: false },
  { time: '13:00', busy: false }, { time: '14:00', busy: false }, { time: '15:00', busy: false },
  { time: '16:00', busy: false }, { time: '17:00', busy: false }, { time: '18:00', busy: false },
];

export function getSlotsForDate(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  const key = `${year}-${m}-${d}`;
  return SLOTS_DATA[key] || DEFAULT_SLOTS;
}