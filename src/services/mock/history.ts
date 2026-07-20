import { WeeklyDistancePoint, TerritoryPoint } from '../../types/history';

const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function formatWeekLabel(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function buildMockWeeklyDistance(): WeeklyDistancePoint[] {
  const start = new Date(2026, 0, 5);
  const weeks: WeeklyDistancePoint[] = [];

  for (let i = 0; i < 27; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i * 7);

    // simula uma única semana com atividade, em torno de 8 de maio,
    // reproduzindo o estado "conta nova" do mockup
    const isHighlighted = date.getMonth() === 4 && date.getDate() <= 10;

    weeks.push({
      weekStart: date.toISOString(),
      label: formatWeekLabel(date),
      distanceKm: isHighlighted ? 0.18 : 0,
    });
  }

  return weeks;
}

export const MOCK_WEEKLY_DISTANCE = buildMockWeeklyDistance();

// vazio de propósito — reproduz o estado "dados insuficientes ainda"
export const MOCK_TERRITORY_OVER_TIME: TerritoryPoint[] = [];