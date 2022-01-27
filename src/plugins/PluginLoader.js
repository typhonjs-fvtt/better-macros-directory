import {
   SessionStorage,
   TJSGameSettings }       from '@typhonjs-fvtt/runtime/svelte/plugin/system';

import * as DataPlugins    from './data/index.js';
import * as SystemPlugins  from './system/index.js';

import pluginManager       from './PluginManager.js';

export default class PluginLoader
{
   static async foundryInit()
   {
      await pluginManager.addAll([
         // System plugins -------------------------------------------------------------------------------------------

         // Manages session storage w/ Svelte stores for each session item.
         {
            name: 'tjs-system-session-storage',
            instance: new SessionStorage(),
            options: { eventPrepend: 'bmd' }
         },
         // Add setting dispatch / triggers events w/ data for all settings changes; also provides Svelte stores.
         {
            name: 'tjs-system-game-settings',
            instance: new TJSGameSettings()
         },
         // Add setting control / responder to settings changes.
         {
            name: 'bmd-system-settings-control',
            instance: new SystemPlugins.SettingsControl()
         },
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

         // Add view manager.
         {
            name: 'bmd-system-ui-view-manager',
            instance: SystemPlugins.ViewManager
         }
      ]);
   }
}