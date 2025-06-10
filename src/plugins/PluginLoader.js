import { TJSPSessionStorage } from '#runtime-plugins/svelte/store/web-storage';

import * as DataPlugins       from './data/index.js';
import * as SystemPlugins     from './system/index.js';

import { pluginManager }      from './PluginManager.js';

export class PluginLoader
{
   static async foundryInit()
   {
      await pluginManager.addAll([
         // Data plugins ---------------------------------------------------------------------------------------------

         // Manages reactive data for macro collection.
         {
            name: 'bmd-data-macros',
            instance: DataPlugins.MacroData
         },

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
}
