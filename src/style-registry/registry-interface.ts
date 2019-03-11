export interface RegistryInterface {
    register: (id: string, styles: string) => void;
    has: (id: string) => boolean;
}
