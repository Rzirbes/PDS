import { startOfMonth, endOfMonth, startOfWeek, addWeeks } from 'date-fns'

export function generateWeeklyIntervalsForMonth(referenceDate = new Date()) {
    const weeks: { startDate: Date; endDate: Date }[] = []
    let current = startOfWeek(startOfMonth(referenceDate), { weekStartsOn: 0 })
    const last = endOfMonth(referenceDate)

    while (current < last) {
        const startDate = current
        const endDate = addWeeks(current, 1)
        weeks.push({ startDate, endDate })
        current = endDate
    }

    return weeks
}