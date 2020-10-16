export const camelToKebabCase = (str: string) =>
    str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
