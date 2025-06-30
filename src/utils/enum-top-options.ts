export function enumToOptions<T extends Record<string, string>>(record: T) {
    return Object.entries(record).map(([value, label]) => ({
        value,
        label,
    }));
}