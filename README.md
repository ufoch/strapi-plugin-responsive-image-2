# strapi-plugin-responsive-image-2

Custom responsive image formats for strapi v5. Successor of abandoned strapi-plugin-responsive-image (https://github.com/nicolashmln/strapi-plugin-responsive-image).

## Remarks about migrating from the original strapi responsive image plugin

- If you had lots of configurations in the original responsive image plugin, please consider saving your configuration before migrating.
  **This plugin does NOT automatically migrate previous configurations, so any configurations, which haven't been saved will be lost.**

- Due to the use of the new strapi design system v2, dropdowns need to be scrolled using a hidden scrollbar, which only shows on hovering, to see all entries.

## Installation

```bash
npm install strapi-plugin-responsive-image-2
```

To make strapi use the custom image manipulation service of the plugin, there needs to be a file src/extensions/upload/strapi-server.ts in your strapi project with the following code:

```typescript
const server = require('strapi-plugin-responsive-image-2/strapi-server');

export default (plugin) => {
  plugin.services['image-manipulation'] = server.services.imageManipulation;

  return plugin;
};
```

## Configuration

For configuration, there are [global options](https://github.com/nicolashmln/strapi-plugin-responsive-image?tab=readme-ov-file#global-options) and [per-format options](https://github.com/nicolashmln/strapi-plugin-responsive-image?tab=readme-ov-file#format-options).

## Added improvements

- Conversion to TypeScript project
- Uses the new [strapi plugin SDK](https://docs.strapi.io/cms/plugins-development/plugin-sdk)
- Included fix for broken global quality setting (see [this issue](https://github.com/nicolashmln/strapi-plugin-responsive-image/issues/49))
- Added german UI translations

## Known issues

- On the settings page, the sticky headers of the original plugin are not working correctly after the migration to the new design system.
