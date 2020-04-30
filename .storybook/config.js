import { configure, addDecorator } from '@storybook/react';
import { withPerformance } from 'storybook-addon-performance';

addDecorator(withPerformance);

configure(require.context('../examples', true, /\.tsx$/), module);
