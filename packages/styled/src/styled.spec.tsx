import React from 'react';
import css from '@trousers/core';
import styled from './styled';
import { render } from '@testing-library/react';

describe('styled', () => {
    it('creates a styled component from dot notation element id', () => {
        const StyledDiv = styled.div(
            css('element', {
                color: 'red',
            }),
        );

        const { container } = render(<StyledDiv />);

        expect(container).toMatchSnapshot();
    });

    it('creates a styled component from string element id', () => {
        const StyledDiv = styled('div')(
            css('element', {
                color: 'red',
            }),
        );

        const { container } = render(<StyledDiv />);

        expect(container).toMatchSnapshot();
    });

    it('passes through html attributes', () => {
        const StyledDiv = styled('div')(
            css('element', {
                color: 'red',
            }),
        );

        const { container } = render(<StyledDiv data-testid="foo" />);

        expect(container).toMatchSnapshot();
    });

    it('passes through modifier props', () => {
        const StyledDiv = styled('div')(
            css('element', {
                color: 'red',
            }).modifier('primary', { color: 'green' }),
        );

        const { container } = render(<StyledDiv $primary />);

        expect(container).toMatchSnapshot();
    });

    it('passes through multiple modifier props', () => {
        const StyledDiv = styled('div')(
            css('element', {
                color: 'red',
            })
                .modifier('primary', { color: 'green' })
                .modifier('secondary', { color: 'purple' }),
        );

        const { container } = render(<StyledDiv $primary $secondary />);

        expect(container).toMatchSnapshot();
    });
});
