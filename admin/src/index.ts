import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { pluginPermissions } from './permissions';

type TradOptions = Record<string, string>;

const prefixPluginTranslations = (trad: TradOptions, pluginId: string): TradOptions => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {} as TradOptions);
};

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },
  bootstrap(app: any) {
    app.addSettingsLink('global', {
      id: 'responsive-image-settings',
      intlLabel: { id: getTranslation('plugin.name'), defaultMessage: 'Responsive image 2' },
      to: 'responsive-image-2',
      Component: () => import('./pages/Settings'),
      permissions: pluginPermissions.settings,
    });
  },
  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data: prefixPluginTranslations(data, PLUGIN_ID), locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
