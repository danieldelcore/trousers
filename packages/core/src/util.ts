export function toHyphenLower(match: any) {
    return '-' + match.toLowerCase();
}

export const camelToSnakeCase = (str: string) =>
    str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
