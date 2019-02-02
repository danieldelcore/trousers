import { configure } from '@storybook/react';

const req = require.context('.', true, /\.tsx$/);

const load = () => {
    req.keys().forEach(req);
}

configure(load, module);
