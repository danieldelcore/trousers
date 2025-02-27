import { CollectorReturn } from '@trousers/core';

// eslint-disable-next-line @typescript-eslint/prefer-interface
export type TrousersProps = {
    css?: CollectorReturn;
    [key: string]: any; // Will need to use template literal types in ts 4.1
};
