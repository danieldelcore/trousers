export default interface StyleRegistryInterface {
    register: (id: string, styles: string) => void;
    registerGlobal: (styles: string) => void;
    has: (id: string) => boolean;
    clear: (isGlobal: boolean) => void;
}
