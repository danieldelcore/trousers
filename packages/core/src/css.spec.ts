import css from './css';

describe('css', () => {
    it('returns the correct element name', () => {
        const collector = css`
            font-style: normal;
        `;

        expect(collector.get()[0].name).toEqual('css__');
        expect(collector.get()[0].predicate).toEqual(true);
    });
});
