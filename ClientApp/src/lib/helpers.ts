const transform = (obj: any, predicate: Function) => {
    return Object.keys(obj).reduce((memo: any, key: string) => {
        if (predicate(obj[key], key)) {
            memo[key] = obj[key]
        }
        return memo
    }, {})
}

export const omit = (obj: any, items: string[]) => transform(obj, (value: any, key: string) => !items.includes(key))
export const pick = (obj: any, items: string[]) => transform(obj, (value: any, key: string) => items.includes(key))

export const sleep = (delay: number) => new Promise(r => setTimeout(r, delay));

export function isType<T>(object: any): object is T {
    return 'fooProperty' in object;
}
