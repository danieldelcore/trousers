/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CSSObject,
    Collector as CoreCollector,
    CollectorReturn as CoreCollectorReturn,
} from '@trousers/core';

export type CollectorReturn = CoreCollectorReturn;
export type Collector = CoreCollector;

function css(styles: CSSObject): CollectorReturn;
function css(
    idOrStyle: string | CSSObject,
    styles?: CSSObject,
): CollectorReturn;
function css(
    idOrStyle: string | CSSObject,
    styles?: CSSObject,
): CollectorReturn {
    const self: CollectorReturn = {
        modifier: (modifierId, modifierStyles) => self,
        global: globalStyles => self,
        theme: theme => self,
        _get: () => [],
    };

    return self;
}

export default css;
