import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import BMDAppShell           from './BMDAppShell.svelte';

import { constants, sessionConstants } from '#constants';

/**
 * Provides the default position for BMDirectory if not defined.
 *
 * @type {{top: number, width: number}}
 */
const s_DEFAULT_POSITION = { top: 80, width: 325 };

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

   /**
    * Saves the position with a debounce to session storage.
    *
    * @inheritDoc
    */
   setPosition(pos = {})
   {
      const currentPosition = super.setPosition(pos);

      s_SAVE_POSITION(currentPosition, this._eventbus);

      return currentPosition;
   }

   onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      try
      {
         /**
          * Retrieves and sets any stored position from session storage.
          *
          * @type {object}
          * {@link Application.position}
          */
         const position = JSON.parse(
          this._eventbus.triggerSync('bmd:storage:session:item:get', sessionConstants.bmdPosition, {}));

         if (position !== null && typeof position === 'object')
         {
            const constraints = (({left, top, width, height}) => ({left, top, width, height}))(position);

            if (Object.keys(constraints).length > 0) { this.position = Object.assign(this.position, constraints); }
         }
      }
      catch (err)
      {
         this.position = s_DEFAULT_POSITION;
      }
   }
}

/**
 * Provides a debounced function to save position to {@link BMDSessionConstants.bmdPosition}.
 */
const s_SAVE_POSITION = foundry.utils.debounce((currentPosition, eventbus) =>
{
   eventbus.triggerSync('bmd:storage:session:item:set', sessionConstants.bmdPosition, JSON.stringify(currentPosition));
}, 500);