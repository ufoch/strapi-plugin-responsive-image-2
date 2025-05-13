/**
 * responsive-image.ts service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

export default ({ strapi }) => {
  return {
    getSettings() {
      return strapi
        .store({
          type: 'plugin',
          name: 'responsive-image-2',
          key: 'settings',
        })
        .get();
    },

    setSettings(value) {
      return strapi
        .store({
          type: 'plugin',
          name: 'responsive-image-2',
          key: 'settings',
        })
        .set({ value });
    },
  };
};
