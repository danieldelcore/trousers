import css from './css';

describe('css', () => {
    it('returns the correct element name', () => {
        const collector = css`
            font-style: normal;
        `;

        expect(collector.get().name).toEqual('css__');
    });

    it('registers styles', () => {
        const collector = css`
            font-style: normal;
        `;

        expect(collector.get().hash).toEqual('4061766009');
    });
});
