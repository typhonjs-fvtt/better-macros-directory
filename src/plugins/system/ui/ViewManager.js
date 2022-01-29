import * as Views from '#views';

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

      Hooks.on('renderHotbar', this.#hotbarRendered.bind(this));
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
         elementClone.addEventListener('click', () => Apps.directory.render(true, { focus: true }));
         elementClone.addEventListener('contextmenu', () => ui.macros.renderPopout(true));
      }
   }

   static async onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      await this.init();
   }
}