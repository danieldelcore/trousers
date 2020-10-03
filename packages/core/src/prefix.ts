import { compile, serialize, stringify, namespace, middleware } from 'stylis';

const prefix = (id: string, styles: string) =>
    serialize(compile(`${id}{${styles}}`), middleware([namespace, stringify]));

export default prefix;
