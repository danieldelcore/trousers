export { default as css, SingleStyleCollector } from './css';
export { default as useGlobal } from './useGlobal';
export { ServerStyleRegistry } from './styles';
export {
    ThemeProvider,
    ThemeConumser,
    ThemeContext,
    ThemeCtx,
    ThemeProviderProps,
} from './ThemeContext';
export {
    ServerProvider,
    ServerConumser,
    ServerContext,
    ServerCtx,
} from './ServerContext';

import useTrousers from './useTrousers';
import styleCollector, { StyleCollector } from './style-collector';
import withStyles from './withStyles';

export {
    styleCollector,
    styleCollector as trousers,
    StyleCollector,
    useTrousers,
    useTrousers as useStyles,
    withStyles,
    withStyles as withTrousers,
};
