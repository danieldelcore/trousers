export { default as css, SingleStyleCollector } from './css';
export { default as useGlobals } from './useGlobals';
export { default as withGlobals } from './withGlobals';
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

import styleCollector, { StyleCollector } from './style-collector';
import useStyles from './useStyles';
import withStyles from './withStyles';

export {
    styleCollector,
    styleCollector as trousers,
    StyleCollector,
    useStyles,
    useStyles as useTrousers,
    withStyles,
    withStyles as withTrousers,
};
