import PluginLoader     from './plugins/PluginLoader.js';

import '../styles/init.scss'; // Include the module styles to be picked up by PostCSS.

Hooks.once('init', async () =>
{
   await PluginLoader.foundryInit();

   // Append main stylesheet to `head`.
   document.getElementsByTagName('head')[0].append(Object.assign(document.createElement('link'), {
      href: 'modules/better-macro-directory/dist/better-macro-directory.css',
      rel: 'stylesheet',
      type: 'text/css',
      media: 'all'
   }));
});

Hooks.once('ready', async () => await PluginLoader.foundryReady());