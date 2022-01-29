import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import BMDAppShell           from './BMDAppShell.svelte';

import { constants, sessionConstants } from '#constants';

export default class BMDirectory extends SvelteApplication
{
   /**
    * @inheritDoc
    */
   constructor(options = {}) { super(options); }

   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         id: constants.moduleName,
         popOut: true,
         resizable: true,
         minimizable: true,
         width: 325,
         height: 300,
         title: game.i18n.localize('bmd.settings.title'),
         headerButtonNoLabel: true,
         svelte: {
            class: BMDAppShell,
            target: document.body,
            intro: true
         }
      });
   }

   /**
    * Specify the set of config buttons which should appear in the Application header. Buttons should be returned as an
    * Array of objects.
    *
    * Provides an explicit override of Application._getHeaderButtons to add
    *
    * @returns {ApplicationHeaderButton[]} The app header buttons.
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
         title: themeDarkMode ? 'bmd.buttons.darkmode.disable' : 'bmd.buttons.darkmode.enable',

         onclick: function()
         {
            const newThemeDarkMode = eventbus.triggerSync('bmd:storage:session:item:boolean:swap',
             sessionConstants.themeDarkMode);

            this.icon = newThemeDarkMode ? 'fas fa-moon on' : 'fas fa-moon off';
            this.title = newThemeDarkMode ? 'bmd.buttons.darkmode.disable' : 'bmd.buttons.darkmode.enable';
         }
      });

      return buttons;
   }

   onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;
   }
}