import { configure } from '@storybook/react';

const req = require.context('../examples', true, /\.tsx$/);

const load = () => {
    req.keys().forEach(req);
};

configure(load, module);
