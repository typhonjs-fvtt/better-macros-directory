import { writable }           from 'svelte/store';

import { DynArrayReducer }    from '@typhonjs-fvtt/svelte-standard/store';

import { filterSearch }       from './filterSearch.js';
import { filterUser }         from './filterUser.js';
import { sortAlpha }          from './sortAlpha.js';

import { Subscribers }        from './Subscribers.js';

/**
 * Provides the data preparation and generation for the Svelte view layer. MacroData takes advantage of the core
 * {@link SidebarDirectory} data preparation and augments the returned results with reactive storage. The "render"
 * method is implemented and this class is added as an "app" to the macros collection. When any updates / changes occur
 * the core Foundry data preparation is kicked off and the resulting data is set to a Svelte store.
 */
export class MacroData
{
   static tree = writable({ root: true, content: [], children: [] });
   static userSelect = {};

   /**
    * Recursive function that augments the data structure returned by {@link SidebarDirectory.setupFolders}
    * converting the 'content' array to a DynArrayReducer store w/ two filters for retaining macros owned by a specific
    * user and a keyword search. Additionally, an alpha sort can be applied to any remaining macros & folders.
    *
    * @param {object}   data - Data from SidebarDirectory.
    *
    * @returns {object} Augmented tree structure.
    */
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

   /**
    * Builds the macro directory tree structure utilizing the Foundry {@link SidebarDirectory} for parsing.
    */
   static buildTree()
   {
      // Run all unsubscribe functions for DynArrayReducer subscriptions added previously.
      Subscribers.unsubscribeAll();

      const folders = game.folders.filter((f) => f.type === 'Macro');
      const documents = game.collections.get('Macro').filter((e) => e.visible);

      const tree = this.augmentTree(SidebarDirectory.setupFolders(folders, documents));

      tree.filterSearch = filterSearch;
      tree.sortAlpha = sortAlpha;
      tree.userSelect = this.userSelect;

      this.tree.set(tree);
   }

   /**
    * Provides a bare-bones render implementation that ensures the update is one we are interested in and if so
    * the data structure is rebuilt. This mainly occurs as core Foundry is bound to Handlebars / JQuery and any changes
    * require a full render cycle. Instead of rewriting all of that code we still leverage the core functionality and
    * augment the returned results. Downstream Svelte is smart enough to not re-render everything.
    *
    * @inheritDoc
    */
   static render(force, options = {})
   {
      const { action, data, documentType } = options;

      if (action && !['create', 'update', 'delete'].includes(action)) { return this; }

      if ((documentType !== 'Folder') && (action === 'update') && !data.some(
       (d) => s_RENDER_UPDATE_KEYS.some((k) => k in d))) { return; }

      this.buildTree();
   }

   /**
    * This method is invoked when adding this plugin to the plugin manager and sets up the initial data.
    *
    * @param {object} ev -
    */
   static onPluginLoad(ev)
   {
      game.macros.apps.push(this);

      this.userSelect = {
         selected: '',
         options: [{ label: 'All', value: '' }, ...[...game.users].map((u) => ({ label: u.name, value: u.id })).sort(
          (a, b) => a.label.localeCompare(b.label))],
         store: filterUser
      };

      this.buildTree();

      ev.eventbus.on('bmd:data:macro:directory:get', () => this.tree, this, { guard: true });
   }
}

const s_RENDER_UPDATE_KEYS = ['name', 'img', 'thumb', 'permission', 'sort', 'sorting', 'folder'];
