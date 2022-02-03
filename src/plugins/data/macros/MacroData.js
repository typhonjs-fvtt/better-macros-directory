import { writable }        from 'svelte/store';

import {
   DynArrayReducer,
   TJSDocumentCollection } from '@typhonjs-fvtt/runtime/svelte/store';

import { filterSearch }    from './filterSearch.js';
import { filterUser }      from './filterUser.js';
import { sortAlpha }       from './sortAlpha.js';

import { Subscribers }     from './Subscribers.js';

/**
 * Provides the data preparation and generation for the Svelte view layer. MacroData takes advantage of the core
 * {@link SidebarDirectory} data preparation and augments the returned results with reactive storage. When any updates /
 * changes occur the core Foundry data preparation is kicked off and the resulting data is augmented and set to a
 * Svelte store.
 */
export class MacroData
{
   /**
    * @type {TJSDocumentCollection}
    */
   static #collection;

   static #tree = writable({ root: true, content: [], children: [] });
   static #userSelect = {};

   /**
    * Recursive function that augments the data structure returned by {@link SidebarDirectory.setupFolders}
    * converting the 'content' array to a DynArrayReducer store w/ two filters for retaining macros owned by a specific
    * user and a keyword search. Additionally, an alpha sort can be applied to any remaining macros & folders.
    *
    * @param {object}   data - Data from SidebarDirectory.
    *
    * @returns {object} Augmented tree structure.
    */
   static #augmentTree(data)
   {
      data.contentStore = new DynArrayReducer({
         data: data.content,
         filters: [filterSearch, filterUser],
         sort: sortAlpha
      });

      for (const child of data.children) { this.#augmentTree(child); }

      return data;
   }

   /**
    * Builds the macro directory tree structure utilizing the Foundry {@link SidebarDirectory} for parsing. Since core
    * Foundry is bound to Handlebars / JQuery any changes to any macro require a full render cycle. Foundry core
    * rebuilds the entire folder / document structure for all sidebars each render via Handlebars. Instead of rewriting
    * all of that parsing code and creating a more long-lived reactive data structure we leverage the core functionality
    * and augment the returned results w/ DynArrayReducer for all content arrays. Downstream Svelte is smart enough to
    * not re-render everything.
    */
   static #buildTree()
   {
      // Run all unsubscribe functions for DynArrayReducer subscriptions added previously.
      Subscribers.unsubscribeAll();

      const folders = game.folders.filter((f) => f.type === 'Macro');
      const documents = game.collections.get('Macro').filter((e) => e.visible);

      const tree = this.#augmentTree(SidebarDirectory.setupFolders(folders, documents));

      tree.filterSearch = filterSearch;
      tree.sortAlpha = sortAlpha;
      tree.userSelect = this.#userSelect;

      this.#tree.set(tree);
   }

   /**
    * This method is invoked when adding this plugin to the plugin manager and sets up the initial data.
    *
    * @param {object} ev -
    */
   static onPluginLoad(ev)
   {
      this.#collection = new TJSDocumentCollection(game.macros);

      this.#userSelect = {
         options: [{ label: 'All', value: '' }, ...[...game.users].map((u) => ({ label: u.name, value: u.id })).sort(
          (a, b) => a.label.localeCompare(b.label))],
         store: filterUser
      };

      // Subscribe to receive updates from `game.macros`.
      this.#collection.subscribe(() =>
      {
         const options = this.#collection.updateOptions;

         //
         const { action, data, documentType } = options;

         if (action && !['create', 'update', 'delete'].includes(action)) { return this; }

         if ((documentType !== 'Folder') && (action === 'update') && !data.some(
          (d) => s_RENDER_UPDATE_KEYS.some((k) => k in d))) { return; }

         this.#buildTree();
      });

      // Build tree initially as the initial response on subscription above will not have any update options set.
      this.#buildTree();

      ev.eventbus.on('bmd:data:macro:directory:get', () => this.#tree, this, { guard: true });
   }
}

const s_RENDER_UPDATE_KEYS = ['name', 'img', 'thumb', 'permission', 'sort', 'sorting', 'folder'];
