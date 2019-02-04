export type Predicate = (...args: any[]) => boolean;

export interface ClassName {
    name: string,
    predicate: Predicate,
}

export default class ClassNameRegistry {
    private classNames: ClassName[] = [];

    push(name: string, predicate: Predicate): number {
        return this.classNames.push({ name, predicate });
    }

    evaluate(...args: any) {
        return this.classNames
            .filter(({ predicate }) => predicate(...args))
            .reduce((accum, { name }) => `${accum}${name} `, '')
            .trim();
    }
}
