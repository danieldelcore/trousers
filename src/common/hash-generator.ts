import { v3 as hash } from 'murmurhash';

let count = 0;

export function generateHash() {
    return hash((count++).toString(10));
};
