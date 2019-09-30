import css from './css';

describe('css', () => {
    it('returns the correct element name', () => {
        const collector = css`
            font-style: normal;
        `;

        expect(collector.getElementName()).toEqual('css');
    });

    it('registers styles', () => {
        const collector = css`
            font-style: normal;
        `;

        expect(collector.get().length).toBe(1);
        expect(collector.get()[0].hash).toEqual('4061766009');
    });
});
