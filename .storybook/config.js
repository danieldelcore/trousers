import { configure } from '@storybook/react';

configure(require.context('../examples', true, /\.tsx$/), module);
