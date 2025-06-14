import { SvelteApplication } from '#runtime/svelte/application';

import BMDAppShell           from './BMDAppShell.svelte';

import { constants, sessionConstants } from '#constants';

export default class BMDirectory extends SvelteApplication
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
      catch (err) { /**/ }
   }

   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         id: constants.moduleId,
         classes: [constants.moduleId],
         popOut: true,
         resizable: true,
         minimizable: true,
         width: 325,
         height: 300,
         minWidth: 200,
         minHeight: 200,
         maxWidth: 500,
         maxHeight: 700,
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

      const themeDarkMode = eventbus.triggerSync('bmd:storage:session:item:get', sessionConstants.themeDarkMode);

      buttons.unshift({
         class: 'theme-dark',
         icon: themeDarkMode ? 'fas fa-moon on' : 'fas fa-moon off',
         label: themeDarkMode ? 'bmd.buttons.darkmode.disable' : 'bmd.buttons.darkmode.enable',

         onPress: ({ button }) =>
         {
            const newThemeDarkMode = eventbus.triggerSync('bmd:storage:session:item:boolean:swap',
             sessionConstants.themeDarkMode);

            button.icon = newThemeDarkMode ? 'fas fa-moon on' : 'fas fa-moon off';
            button.label = newThemeDarkMode ? 'bmd.buttons.darkmode.disable' : 'bmd.buttons.darkmode.enable';
         }
      });

      return buttons;
   }

   onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;
   }
}
