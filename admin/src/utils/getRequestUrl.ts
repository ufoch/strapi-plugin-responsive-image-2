import { PLUGIN_ID } from '../pluginId';

const getRequestUrl = (path: string) => `/${PLUGIN_ID}/${path}`;

export { getRequestUrl };