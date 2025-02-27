/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CSSObject,
    Collector as CoreCollector,
    CollectorReturn as CoreCollectorReturn,
} from '@trousers/core';

export type CollectorReturn = CoreCollectorReturn;
export type Collector = CoreCollector;

function css(_styles: CSSObject): CollectorReturn;
function css(
    _idOrStyle: string | CSSObject,
    _styles?: CSSObject,
): CollectorReturn;
function css(
    _idOrStyle: string | CSSObject,
    _styles?: CSSObject,
): CollectorReturn {
    const self: CollectorReturn = {
        modifier: (_modifierId, _modifierStyles) => self,
        global: _globalStyles => self,
        theme: _theme => self,
        _get: () => [],
    };

    return self;
}

export default css;
