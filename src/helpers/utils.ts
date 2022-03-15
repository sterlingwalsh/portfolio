export const killEvt = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
};
export const isFiniteOrNan = (num: number) => {
    if (isNaN(num) || !isFinite(num)) {
        return 0;
    } else {
        return num;
    }
};
export const clamp = (pref: number, min?: number, max?: number) => Math.max(Math.min(pref, max ?? pref), min ?? pref);
export const clsx = (...classes: (string | undefined | null | false)[]) => {
    let c = '';
    for (let i = 0; i < classes.length; i++) {
        if (classes[i]) {
            if (c) c += ' ';
            c += classes[i];
        }
    }
    return c;
};
export function iterMap<K = any, V = any, R = any>(
    map: Map<K, V> | undefined,
    callback: (value: V, key: K, map: Map<K, V>) => R,
    filterFunc?: (value: V, key: K, map: Map<K, V>) => boolean
): R[] {
    if (!map) return [];
    const r: R[] = [];
    map.forEach((value, key, map) => {
        if (filterFunc && !filterFunc(value, key, map)) return;
        r.push(callback(value, key, map));
    });
    return r;
}
export function reduceMap<K = any, V = any, R = any>(map: Map<K, V> | undefined, callback: (previousValue: R, value: V, key: K, map: Map<K, V>) => R, initialValue: R) {
    if (!map) return initialValue;
    map.forEach((v, k, map) => {
        initialValue = callback(initialValue, v, k, map);
    });
    return initialValue;
}
export function iterSet<V = any, R = any>(set: Set<V> | undefined, callback: (value: V, set: Set<V>) => R, filterFunc?: (value: V, set: Set<V>) => boolean): R[] {
    if (!set) return [];
    const r: R[] = [];
    set.forEach((value, key, set) => {
        if (filterFunc && !filterFunc(value, set)) return;
        r.push(callback(value, set));
    });
    return r;
}
interface ColorRGB {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a?: number;
}
export const colorIsDark = (c: ColorRGB) => Math.sqrt(c.r * c.r * 0.241 + c.g * c.g * 0.691 + c.b * c.b * 0.068) < 130;
interface PollingStatus {
    cancel: () => void;
}
/**
 * helper function to wrap the polling logic to make testing easier
 * @param callback function to call after the given time, if success and needs to stop, return true
 * @param time time to wait between checks
 */
export function poll(callback: () => Promise<boolean>, time: number): PollingStatus {
    let timeout: NodeJS.Timeout | undefined = undefined;
    const poller = async () => {
        timeout = undefined;
        if (!(await callback())) timeout = setTimeout(poller, time);
    };
    timeout = setTimeout(poller, time);
    return {
        cancel: () => {
            if (timeout) clearTimeout(timeout);
        },
    };
}
