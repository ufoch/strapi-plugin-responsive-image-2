'use strict';

import '@strapi/strapi';

const getService = (name) => {
  return strapi.service(`plugin::responsive-image-2.${name}`);
};

export default getService;
