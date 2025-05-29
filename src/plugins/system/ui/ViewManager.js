import * as Views from '#views';

const Apps = {
   directory: void 0
};

export class ViewManager
{
   static async #init()
   {
      Apps.directory = new Views.BMDirectory();

      await this._eventbus.triggerAsync('plugins:async:add', {
         name: 'bmd-view-bm-directory',
         instance: Apps.directory
      });

      // Hooks.on('renderHotbar', this.#hotbarRendered.bind(this));
      Hooks.on('ready', this.#sidebarRendered.bind(this));
   }

   /**
    * Add context menu listener to sidebar macro directory button to launch BMD. Potentially in the future an entire
    * sidebar replacement is done.
    */
   static #sidebarRendered()
   {
      const button = globalThis.document.querySelector('button.ui-control[data-tab="macros"]');

      if (button)
      {
         button.addEventListener('contextmenu', (event) =>
         {
            event.preventDefault();
            event.stopImmediatePropagation();

            Apps.directory.render(true, { focus: true });
         });
      }
   }

   static async onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      await this.#init();
   }
}
