import PluginLoader     from './plugins/PluginLoader.js';

import '../styles/init.scss'; // Include the module styles to be picked up by PostCSS.

Hooks.once('init', async () => await PluginLoader.foundryInit());
Hooks.once('ready', async () => await PluginLoader.foundryReady());