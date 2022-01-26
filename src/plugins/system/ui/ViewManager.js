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

   static renderDirectory()
   {
      Apps.directory.render(true, { focus: true });
   }

   static async onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      await this.init();

      const opts = { guard: true };

      ev.eventbus.on('bmd:system:viewmanager:bettermacros:render', this.renderDirectory, this, opts);
   }
}