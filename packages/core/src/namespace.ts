export type RuleSet = Record<string, Record<string, number | string>>;

function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target: any, ...sources: any): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

function namespace(id: string, style: Record<string, any>): RuleSet {
    return Object.entries(style).reduce<RuleSet>((accum, [property, value]) => {
        if (typeof value !== 'object') {
            if (!accum[id]) accum[id] = {};
            accum[id][property] = value;
            return accum;
        }

        if (property.includes('@keyframe')) {
            return mergeDeep(accum, {
                [property]: Object.entries(value).reduce<RuleSet>(
                    (
                        nestedAccum,
                        [nestedProp, nestedValue]: [string, any],
                    ) => ({
                        ...nestedAccum,
                        ...namespace(nestedProp, nestedValue),
                    }),
                    {},
                ),
            });
        } else if (property.includes('@media')) {
            return mergeDeep(accum, {
                [property]: namespace(id, value),
            });
        }

        let selector = '';

        if (property.includes('&')) {
            selector = property.replace(new RegExp(/&/, 'g'), id);
        } else if (property.includes('::')) {
            selector = property.replace(new RegExp(/::/, 'g'), id + '::');
        } else if (property.includes(':')) {
            selector = property.replace(new RegExp(/:/, 'g'), id + ':');
        } else {
            selector =
                id + ' ' + property.replace(new RegExp(/,/, 'g'), ', ' + id);
        }

        // TODO: deep merge is a shame
        return mergeDeep(accum, namespace(selector, value));
    }, {});
}

export default namespace;
