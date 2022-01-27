import { writable } from 'svelte/store';

export class MacroData
{
   static tree = writable({ root: true, content: [], children: [] });

   static buildTree()
   {
      const folders = game.folders.filter(f => f.type === 'Macro');
      const documents = game.collections.get('Macro').filter(e => e.visible);

      // Build Tree
      this.tree.set(SidebarDirectory.setupFolders(folders, documents));
   }

   static render(force, options = {})
   {
      const {action, data, documentType} = options;

      if (action && !['create', 'update', 'delete'].includes(action) ) { return this; }

      if ((documentType !== 'Folder') && (action === 'update') && !data.some((d) => {
         return s_RENDER_UPDATE_KEYS.some((k) => k in d);
      })) { return; }

      this.buildTree();
   }


   static onPluginLoad(ev)
   {
      game.macros.apps.push(this);

      this.buildTree();

      ev.eventbus.on('bmd:data:macro:directory:get', () => this.tree, this, { guard: true });
   }
}

const s_RENDER_UPDATE_KEYS = ['name', 'img', 'thumb', 'permission', 'sort', 'sorting', 'folder'];
