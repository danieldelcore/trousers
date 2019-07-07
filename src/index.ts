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

import trousers, { StyleCollector } from './trousers';
import useTrousers from './useTrousers';
import withStyles from './withStyles';

export {
    trousers,
    trousers as styleCollector,
    StyleCollector,
    useTrousers,
    useTrousers as useStyles,
    withStyles,
    withStyles as withTrousers,
};
