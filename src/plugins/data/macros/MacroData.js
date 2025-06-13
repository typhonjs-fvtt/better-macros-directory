import { writable }              from 'svelte/store';

import { DynArrayReducer }       from '#runtime/svelte/store/reducer';

import { TJSDocumentCollection } from '#runtime/svelte/store/fvtt/document';

import { filterSearch }          from './filterSearch.js';
import { filterUser }            from './filterUser.js';
import { sortAlpha }             from './sortAlpha.js';

/**
 * Provides the data preparation and generation for the Svelte view layer. MacroData takes advantage of the core
 * {@link DocumentCollection.tree} data preparation and augments the returned results with reactive storage. When any
 * updates / changes occur, the core Foundry data preparation is kicked off and the resulting data is augmented and set
 * to a Svelte store.
 *
 * Note: This plugin loads in the `init` hook to support sidebar embedding. The data is initialized in the `ready` hook.
 */
export class MacroData
{
   /**
    * Respond to these collection action changes.
    *
    * @type {Set<string>}
    */
   static #actionTypes = new Set(['createFolder', 'deleteFolder', 'updateFolder', 'createMacro', 'deleteMacro',
    'updateMacro']);

   /**
    * @type {TJSDocumentCollection}
    */
   static #collection = new TJSDocumentCollection();

   /**
    * Stores all dynamic reducers created for the tree such that the filter / sort functions may be cleared when the
    * tree is rebuilt.
    *
    * @type {import('#runtime/svelte/store/reducer').DynArrayReducer[]}
    */
   static #dynReducers = [];

   /**
    * Respond to only these macro data updates.
    *
    * @type {string[]}
    */
   static #macroDataUpdates = ['name', 'img', 'thumb', 'ownership', 'sort', 'sorting', 'folder'];

   /**
    * Stores game user data for TJSSelect.
    *
    * @type {{}}
    */
   static #userSelect = {};

   /**
    * Stores the macro tree data.
    *
    * @type {Writable<{root: boolean, content: [], children: []}>}
    */
   static #tree = writable({
      root: true,
      content: [],
      children: [],
      documentStore: new DynArrayReducer(),
      filterSearch,
      sortAlpha,
      userSelect: MacroData.#userSelect
   });

   /**
    * Recursive function that augments the data structure returned by {@link DocumentCollection.tree}
    * converting the 'content' array to a DynArrayReducer store w/ two filters for retaining macros owned by a specific
    * user and a keyword search. Additionally, an alpha sort can be applied to any remaining macros & folders.
    *
    * @param {object}   data - Data from SidebarDirectory.
    *
    * @returns {object} Augmented tree structure.
    */
   static #augmentTree(data)
   {
      // Track reducer created as it must be cleaned up when the tree is rebuilt.
      this.#dynReducers.push(data.documentStore = new DynArrayReducer({
         data: data.entries,
         filters: [filterUser, filterSearch],
         sort: sortAlpha
      }));

      for (const child of data.children) { this.#augmentTree(child); }

      return data;
   }

   /**
    * Builds the macro directory tree structure utilizing the Foundry {@link DocumentCollection.tree} for parsing.
    * Since core Foundry is bound to Handlebars / JQuery any changes to any macro require a full render cycle. Foundry
    * core rebuilds the entire folder / document structure for all sidebars each render via Handlebars. Instead of
    * rewriting all of that parsing code and creating a more long-lived reactive data structure we leverage the core
    * functionality and augment the returned results w/ DynArrayReducer for all content arrays. Downstream Svelte is
    * smart enough to not re-render everything.
    */
   static #buildTree()
   {
      // Run all unsubscribe functions for DynArrayReducer subscriptions added previously.
      for (const reducer of this.#dynReducers)
      {
         reducer.filters.clear();
         reducer.sort.clear();
      }

      this.#dynReducers.length = 0;

      const newTree = this.#augmentTree(game.collections.get('Macro').tree);

      newTree.filterSearch = filterSearch;
      newTree.sortAlpha = sortAlpha;
      newTree.userSelect = MacroData.#userSelect;

      MacroData.#tree.set(newTree);
   }

   /**
    * This method is invoked when adding this plugin to the plugin manager and sets up the initial data.
    *
    * @param {object} ev -
    */
   static onPluginLoad(ev)
   {
      // Must initialize data after Foundry is `ready`.
      Hooks.once('ready', () =>
      {
         MacroData.#collection.set(game.macros);

         MacroData.#userSelect = {
            options: [{ label: 'All', value: '' }, ...[...game.users].map((u) => ({ label: u.name, value: u.id })).sort(
               (a, b) => a.label.localeCompare(b.label))],
            store: filterUser
         };

         // Subscribe to receive updates from `game.macros`.
         MacroData.#collection.subscribe((col, updateOptions) =>
         {
            const { action, data } = updateOptions;

            if (!MacroData.#actionTypes.has(action)) { return; }

            // Only rebuild tree on some macro data updates.
            if (action === 'updateMacro' && !data.some(
               (d) => MacroData.#macroDataUpdates.some((k) => k in d))) { return; }

            this.#buildTree();
         });

         // Build the tree initially as the initial response on subscription above will not have any update options set.
         this.#buildTree();
      });

      // Event to retrieve the macro directory.
      ev.eventbus.on('bmd:data:macros:directory:get', () => MacroData.#tree, this, { guard: true });
   }
}

