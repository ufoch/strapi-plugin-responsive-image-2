'use strict';

import validateSettings from './validation/settings';
import getService from '../utils';

const ACTIONS = {
  readSettings: 'plugin::upload.settings.read',
};

const fileModel = 'plugin::upload.file';

/**
 * responsive-image.ts controller
 *
 * @description: A set of functions called "actions" of the `responsive-image` plugin.
 */

export default {
  async getSettings(ctx) {
    const data = await getService('responsive-image').getSettings();

    ctx.body = { data };
  },

  async updateSettings(ctx) {
    const {
      request: { body },
      state: { userAbility },
    } = ctx;

    if (userAbility.cannot(ACTIONS.readSettings, fileModel)) {
      return ctx.forbidden();
    }

    const data = await validateSettings(body);

    await getService('responsive-image').setSettings(data);

    ctx.body = { data };
  },
};
