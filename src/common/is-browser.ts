export default function isBrowser() {
    return !!(
        typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement
    );
}
