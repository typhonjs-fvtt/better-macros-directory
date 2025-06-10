import { FVTTSidebarControl } from '#standard/application/control/sidebar';

import * as Views             from '#views';

const Apps = {
   directory: void 0
};

export class ViewManager
{
   static #init()
   {
      // Replace core macro directory sidebar.
      FVTTSidebarControl.replace({
         id: 'macros',
         tooltip: 'Macro+',
         title: 'Macro+',

         popoutApplication: Views.BMDirectory,

         // Add sidebar popout app to the eventbus as a plugin.
         popoutPostInitialize: (app) =>
         {
            Apps.directory = app;

            this._eventbus.triggerAsync('plugins:async:add', {
               name: 'bmd-view-bm-directory',
               instance: app
            });
         },

         icon: 'fa-solid fa-code',
         svelte: {
            class: Views.MacroDirectory,
            context: {
               '#external': {
                  eventbus: this._eventbus
               }
            }
         }
      });
   }

   static async onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      await this.#init();
   }
}
