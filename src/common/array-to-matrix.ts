const arrayToMatrix = <T extends any[]>(arr: T, width: number) =>
    arr.reduce(
        (rows, key, index) =>
            (index % width == 0
                ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows,
        [],
    );

export default arrayToMatrix;
