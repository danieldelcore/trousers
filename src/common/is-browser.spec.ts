/**
 * @jest-environment node
 */

import { JSDOM } from 'jsdom';

import { isBrowser } from './';

 describe('isBrowser', () => {
    it('detect node environment', () => {
        const result = isBrowser();

        expect(result).toEqual(false);
    });

     it('detect browser environment', () => {
         const jsdom = new JSDOM(`<!doctype html><html><body></body></html>`);
         const { window } = jsdom;

         // @ts-ignore
         global.window = window;
         // @ts-ignore
         global.document = window.document;

         const result = isBrowser();

         expect(result).toEqual(true);
     });
})
