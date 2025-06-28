export function maskCpf(value: string): string {
    return value
        .replace(/\D/g, '') // remove não-dígitos
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskPhone(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
}

export function maskZipCode(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
}

export function maskDate(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{2})(\d)/, '$1-$2')
        .slice(0, 10);
}