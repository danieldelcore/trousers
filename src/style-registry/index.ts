import { isBrowser } from '../common';

import ClientRegistry from './client-registry';
import ServerRegistry from './server-registry';

export default function createRegistry(
    attributeId: string,
) {
    let registry;

    if (isBrowser()) {
        const element = document.getElementsByTagName('head')[0];
        registry = new ClientRegistry(element, attributeId);
    } else {
        registry = new ServerRegistry(attributeId);
    }

    return registry;
}
