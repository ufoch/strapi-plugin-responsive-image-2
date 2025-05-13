'use strict';
/**
 * Upload plugin bootstrap.
 *
 * It initializes the provider and sets the default settings in db.
 */

export default async ({ strapi }) => {
  // set plugin store
  const configurator = strapi.store({
    type: 'plugin',
    name: 'responsive-image-2',
    key: 'settings',
  });

  // if provider config does not exist set one by default
  const config = await configurator.get();

  if (!config) {
    await configurator.set({
      value: {
        formats: [
          {
            name: 'large',
            width: 1000,
            fit: 'cover',
            position: 'centre',
            withoutEnlargement: false,
            convertToFormat: '',
          },
          {
            name: 'medium',
            width: 750,
            fit: 'cover',
            position: 'centre',
            withoutEnlargement: false,
            convertToFormat: '',
          },
          {
            name: 'small',
            width: 500,
            fit: 'cover',
            position: 'centre',
            withoutEnlargement: false,
            convertToFormat: '',
          },
        ],
        quality: 87,
        progressive: true,
      },
    });
  }
};
