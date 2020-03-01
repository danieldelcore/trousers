import styleCollector from './style-collector';

describe('styleCollector', () => {
    it('returns the correct element name', () => {
        const collector = styleCollector('my-element-name').element``;

        expect(collector.get()[0].name).toEqual('my-element-name__');
    });

    it('registers an element', () => {
        const collector = styleCollector('myBlock').element`
                font-style: normal;
            `;

        expect(collector.get().length).toBe(1);
        expect(collector.get()[0].hash).toEqual('2111092729');
    });

    it('registers an element and modifier', () => {
        const collector = (props: { isBold: boolean }) => styleCollector(
            'myBlock',
        ).element`
                font-style: normal;
            `.modifier(!!props.isBold)`
                font-style: bold;
            `;

        const styleDefinitions = collector({ isBold: true }).get();

        expect(styleDefinitions.length).toBe(2);
        expect(styleDefinitions[1].hash).toEqual('2064733655');
        expect(styleDefinitions[1].predicate).toBe(true);
    });

    it('registers an element and named modifier', () => {
        const collector = (props: { isBold: boolean }) => styleCollector(
            'myBlock',
        ).element`
                font-style: normal;
            `.modifier('bold', !!props.isBold)`
                font-style: bold;
            `;

        const styleDefinitions = collector({ isBold: true }).get();

        expect(styleDefinitions.length).toBe(2);
        expect(styleDefinitions[1].hash).toEqual('bold2064733655');
        expect(styleDefinitions[1].predicate).toBe(true);
    });

    it('registers an element and multiple modifiers', () => {
        interface Props {
            isBold?: boolean;
            isItalic?: boolean;
        }

        const collector = (props: Props) => styleCollector('myBlock').element`
                font-style: normal;
            `.modifier(!!props.isBold)`
                font-style: bold;
            `.modifier(!!props.isItalic)`
                font-style: italic;
            `;

        const styleDefinitions = collector({
            isBold: true,
            isItalic: true,
        }).get();

        expect(styleDefinitions.length).toBe(3);
        expect(styleDefinitions[0].hash).toEqual('2111092729');
        expect(styleDefinitions[1].hash).toEqual('2064733655');
        expect(styleDefinitions[2].hash).toEqual('2172502402');
    });
});
