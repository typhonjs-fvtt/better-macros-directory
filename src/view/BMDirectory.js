import { SvelteApp }    from '#runtime/svelte/application';
import { CrossRealm }   from '#runtime/util';
import { deepMerge }    from '#runtime/util/object';

import BMDAppShell      from './BMDAppShell.svelte';

import {
   constants,
   sessionConstants }   from '#constants';

export default class BMDirectory extends SvelteApp
{
   /** @inheritDoc */
   constructor()
   {
      super();

      try
      {
         // Attempt to parse session storage item and set application state.
         this.state.set(JSON.parse(sessionStorage.getItem(sessionConstants.appState)));
      }
      catch { /**/ }
   }

   /**
    * Default Application options
    *
    * @returns {SvelteApp.Options} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return deepMerge(super.defaultOptions, {
         id: constants.moduleId,
         classes: [constants.moduleId],
         resizable: true,
         minimizable: true,
         width: 325,
         height: 300,
         minWidth: 200,
         minHeight: 250,
         maxWidth: 500,
         headerIcon: `${CONFIG.Macro.sidebarIcon}`,
         title: 'bmd.settings.title',
         svelte: {
            class: BMDAppShell,
            target: document.body
         }
      });
   }

   /**
    * Specify the set of config buttons which should appear in the Application header. Buttons should be returned as an
    * Array of objects.
    *
    * Provides an explicit override of Application._getHeaderButtons to add
    *
    * @returns {fvtt.ApplicationHeaderButton[]} The app header buttons.
    * @override
    */
   _getHeaderButtons()
   {
      const buttons = super._getHeaderButtons();

      const eventbus = this._eventbus;

      const themeTransparent = eventbus.triggerSync('bmd:storage:session:item:get', sessionConstants.themeTransparent);

      buttons.unshift({
         class: 'theme-transparent',
         icon: themeTransparent ? 'fas fa-moon on' : 'fas fa-moon off',
         label: themeTransparent ? 'bmd.buttons.transparency.disable' : 'bmd.buttons.transparency.enable',

         onPress: ({ button, event }) =>
         {
            // Protect against theme swap when popped out.
            if (globalThis !== CrossRealm.getWindow(event))
            {
               console.warn(
                '[Better Macros Directory] warning: Can not swap to / from transparent theme when popped out.');

               return;
            }

            const newThemeTransparent = eventbus.triggerSync('bmd:storage:session:item:boolean:swap',
             sessionConstants.themeTransparent);

            button.icon = newThemeTransparent ? 'fas fa-moon on' : 'fas fa-moon off';
            button.label = newThemeTransparent ? 'bmd.buttons.transparency.disable' : 'bmd.buttons.transparency.enable';
         }
      });

      return buttons;
   }

   onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;
   }
}
