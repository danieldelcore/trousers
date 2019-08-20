export default interface StyleRegistryInterface {
    register: (id: string, styles: string, isGlobal: boolean) => void;
    has: (id: string) => boolean;
    clear: (isGlobal: boolean) => void;
}
