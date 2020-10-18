import { compile, serialize, stringify, middleware, prefixer } from 'stylis';

const prefix = (id: string, styles: string) =>
    serialize(compile(`${id}{${styles}}`), middleware([prefixer, stringify]));

export default prefix;
