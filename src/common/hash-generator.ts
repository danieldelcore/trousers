import { v3 as hash } from 'murmurhash';

export default function generateHash(key: string, seed?: number) {
    return hash(key, seed);
}
