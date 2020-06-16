import { interpolateStyles } from './';

describe('interpolate styles', () => {
    it('expect no interpolation on template string array', () => {
        const result = interpolateStyles([`color: red;`], [], {});

        expect(result).toEqual(`color: red;`);
    });

    it('expect string interpolation', () => {
        const result = interpolateStyles(['color: ', ';'], ['red'], {});

        expect(result).toEqual(`color: red;`);
    });

    it('expect number interpolation', () => {
        const result = interpolateStyles(['width: ', 'px;'], [40], {});

        expect(result).toEqual(`width: 40px;`);
    });

    it('expect theme interpolation', () => {
        const result = interpolateStyles(
            ['width: ', 'px;'],
            [(theme: any) => theme.width],
            { width: 40 },
        );

        expect(result).toEqual(`width: 40px;`);
    });
});
