import { CollectorReturn } from './css';

export interface TrousersProps {
    css?: CollectorReturn;
    [key: string]: any; // Will need to use template literal types in ts 4.1
}
