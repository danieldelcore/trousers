import hyphenate from './hyphenate';

function themify(
    theme: Record<string, any>,
    prefix: string = '',
): Record<string, any> {
    return Object.entries(theme).reduce<Record<string, any>>(
        (accum, [key, value]) => {
            if (typeof value === 'object') {
                return {
                    ...accum,
                    ...themify(value, prefix + hyphenate(key) + '-'),
                };
            }

            accum[`--${prefix}${hyphenate(key)}`] = value;

            return accum;
        },
        {},
    );
}

export default themify;
