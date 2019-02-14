import { v3 as hash } from 'murmurhash';

let count = 0;

function generateHash() {
    return hash((count++).toString(10));
};

export default generateHash;
