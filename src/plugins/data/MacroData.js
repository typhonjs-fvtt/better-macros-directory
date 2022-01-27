import { writable }        from 'svelte/store';
import { DynArrayReducer } from '@typhonjs-fvtt/svelte-standard/store';

import { filterSearch }    from './filterSearch.js';
import { filterUser }      from './filterUser.js';
import { sortAlpha }       from './sortAlpha.js';

export class MacroData
{
   static tree = writable({ root: true, content: [], children: [] });

   static augmentTree(data)
   {
      data.contentStore = new DynArrayReducer({
         data: data.content,
         filters: [filterSearch, filterUser],
         sort: sortAlpha
      });

      for (const child of data.children) { this.augmentTree(child); }

      return data;
   }

   static buildTree()
   {
      const folders = game.folders.filter((f) => f.type === 'Macro');
      const documents = game.collections.get('Macro').filter((e) => e.visible);

      const tree = this.augmentTree(SidebarDirectory.setupFolders(folders, documents));
      tree.filterSearch = filterSearch;
      tree.sortAlpha = sortAlpha;

      tree.userSelect = {
         selected: '',
         options: [{ label: 'All', value: '' }, ...[...game.users].map((u) => ({ label: u.name, value: u.id })).sort(
          (a, b) => a.label.localeCompare(b.label))],
         store: filterUser
      };

      // Build Tree
      this.tree.set(tree);
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
