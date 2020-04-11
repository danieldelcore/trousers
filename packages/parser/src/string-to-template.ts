const stringToTemplate = (str: string) => {
    return ([str] as unknown) as TemplateStringsArray;
};

export default stringToTemplate;
