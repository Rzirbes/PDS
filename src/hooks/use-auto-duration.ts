// hooks/useAutoDuration.ts
import { useEffect } from 'react';

export function useAutoDuration(watch: any, setValue: any) {
    const timeStart = watch('timeStart');
    const timeEnd = watch('timeEnd');

    useEffect(() => {
        if (timeStart && /^\d{2}:\d{2}$/.test(timeStart)) {
            const [h, m] = timeStart.split(':').map(Number);
            const start = new Date();
            start.setHours(h);
            start.setMinutes(m + 50);

            const newH = String(start.getHours()).padStart(2, '0');
            const newM = String(start.getMinutes()).padStart(2, '0');

            setValue('timeEnd', `${newH}:${newM}`);
        }
    }, [timeStart]);

    useEffect(() => {
        if (
            timeStart &&
            timeEnd &&
            /^\d{2}:\d{2}$/.test(timeStart) &&
            /^\d{2}:\d{2}$/.test(timeEnd)
        ) {
            const [startH, startM] = timeStart.split(':').map(Number);
            const [endH, endM] = timeEnd.split(':').map(Number);

            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;

            const duration = endTotal - startTotal;
            if (duration > 0) setValue('duration', duration);
        }
    }, [timeStart, timeEnd]);
}
