import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addWeeks, isBefore, subWeeks, getMinutes, setMilliseconds, setSeconds, setMinutes, setHours } from 'date-fns'

export function generateWeeklyIntervalsForMonth(referenceDate = new Date()) {
    const weeks: { startDate: Date; endDate: Date }[] = []
    let current = startOfWeek(startOfMonth(referenceDate), { weekStartsOn: 0 })
    const last = endOfMonth(referenceDate)

    while (isBefore(current, last) || current.getTime() === last.getTime()) {
        const startDate = current
        const endDate = endOfWeek(current, { weekStartsOn: 0 })
        weeks.push({ startDate, endDate })
        current = addWeeks(current, 1)
    }

    return weeks
}

export function generateWeeklyIntervalsAround(date: Date): { startDate: Date; endDate: Date }[] {
    const base = startOfWeek(date, { weekStartsOn: 0 });
    return [
        subWeeks(base, 2),
        subWeeks(base, 1),
        base,
        addWeeks(base, 1),
        addWeeks(base, 2),
    ].map(start => ({
        startDate: start,
        endDate: endOfWeek(start, { weekStartsOn: 0 }),
    }));
}

export function mergeDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const merged = new Date(date);
    merged.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    return merged;
}


export function getWeekInterval(date: Date) {
    return {
        startDate: startOfWeek(date, { weekStartsOn: 0 }), // 👈 domingo
        endDate: endOfWeek(date, { weekStartsOn: 0 }),     // 👈 sábado
    }
}

