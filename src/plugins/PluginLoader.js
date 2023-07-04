import { TJSPSessionStorage } from '#runtime-plugins/svelte/store/web-storage';

import * as DataPlugins       from './data/index.js';
import * as SystemPlugins     from './system/index.js';

import pluginManager          from './PluginManager.js';

export default class PluginLoader
{
   static async foundryInit()
   {
      await pluginManager.addAll([
         // System plugins -------------------------------------------------------------------------------------------

         // Manages session storage w/ Svelte stores for each session item.
         {
            name: 'tjs-system-session-storage',
            instance: new TJSPSessionStorage(),
            options: { eventPrepend: 'bmd' }
         },
         // Add view manager.
         {
            name: 'bmd-system-ui-view-manager',
            instance: SystemPlugins.ViewManager
         }
      ]);
   }

   static async foundryReady()
   {
      await pluginManager.addAll([
         {
            name: 'bmd-data-macros',
            instance: DataPlugins.MacroData
         },

         // System plugins -------------------------------------------------------------------------------------------
      ]);
   }
}