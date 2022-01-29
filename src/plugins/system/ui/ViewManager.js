import {
   constants,
   sessionConstants }   from "#constants";

import * as Views       from '#views';

const Apps = {
   directory: void 0
};

export class ViewManager
{
   static async init()
   {
      Apps.directory = new Views.BMDirectory();

      await this._eventbus.triggerAsync('plugins:async:add', {
         name: 'bmd-view-bm-directory',
         instance: Apps.directory
      });

      Hooks.on('BetterMacro.Open.Directory', this.renderDirectory);

      Hooks.on('closeBMDirectory', this.#bmdClosed.bind(this));
      Hooks.on('renderBMDirectory', this.#bmdRendered.bind(this));

      Hooks.on('renderHotbar', this.#hotbarRendered.bind(this));

      game.settings.registerMenu(constants.moduleName, 'config', {
         name: 'bmd.settings.config.name',
         label: 'bmd.settings.config.label',
         icon: 'fas fa-palette',
         type: Views.SettingsShim,
         restricted: false
      });

      // If there is an existing session storage item for BMDirectory being open then render it.
      if (this._eventbus.triggerSync('bmd:storage:session:item:get', sessionConstants.bmdOpen, false))
      {
         this.renderDirectory();
      }
   }

   /**
    * Handles the `closeBMDirectory` hook. Setting the session storage item `bmdOpen` to false.
    *
    * @param {BMDirectory}   bmd - The closed BMDirectory app.
    */
   static #bmdClosed(bmd)
   {
      if (!(bmd instanceof Views.BMDirectory)) { return; }

      this._eventbus.triggerSync('bmd:storage:session:item:set', sessionConstants.bmdOpen, false)
   }

   /**
    * Handles the `renderBMDirectory` hook. Setting the session storage item `bmdOpen` to true.
    *
    * @param {BMDirectory}   bmd - The closed BMDirectory app.
    */
   static #bmdRendered(bmd)
   {
      if (!(bmd instanceof Views.BMDirectory)) { return; }

      this._eventbus.triggerSync('bmd:storage:session:item:set', sessionConstants.bmdOpen, true)
   }

   /**
    * Replace core listener for macro directory button to launch BMD from a click and a context menu click opens
    * the old / core macros directory app.
    *
    * @param {Hotbar}   app - Hotbar app
    *
    * @param {JQuery}   html - Hotbar HTML
    */
   static #hotbarRendered(app, html)
   {
      const element = html[0].querySelector('#macro-directory');

      if (element instanceof HTMLElement && element.parentNode instanceof HTMLElement)
      {
         const elementClone = element.cloneNode(true);

         // Clone anchor element to remove all listeners.
         element.parentNode.replaceChild(elementClone, element);

         // Add new listeners; click opens BMD; context menu opens the core / old macros directory app.
         elementClone.addEventListener('click', () => this.renderDirectory());
         elementClone.addEventListener('contextmenu', () => ui.macros.renderPopout(true));
      }
   }

   /**
    * Convenience method to render BMD.
    */
   static renderDirectory()
   {
      Apps.directory.render(true, { focus: true });
   }

   static async onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      await this.init();

      ev.eventbus.on('bmd:system:viewmanager:bettermacros:render', this.renderDirectory, this, { guard: true });
   }
}