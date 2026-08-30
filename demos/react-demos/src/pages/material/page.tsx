import { page } from '@airlib/react';
import { materialRoute } from './route.js';

export const MaterialPage = page(materialRoute).renderAsync(async () => (await import('./PageContent.js')).PageContent);
export default MaterialPage;
