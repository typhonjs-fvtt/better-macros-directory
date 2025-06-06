import { isObject }           from '#runtime/util/object';

import { sessionConstants }   from '#constants';

/**
 * Utility to work with the Foundry folder / document tree structure.
 */
export class TreeControl
{
   /**
    * Convenience method to retrieve the actual Foundry folder document.
    *
    * @param {object}   folder -
    *
    * @returns {object} Actual folder document.
    */
   static #getDoc(folder)
   {
      if (!isObject(folder)) { throw new TypeError(`TreeControl error: 'folder' is not an object`); }

      const doc = folder?.folder ?? folder;

      if (!isObject(doc)) { throw new TypeError(`TreeControl error: 'folder' is not a tree entry`); }

      return doc;
   }

   /**
    * Set all child folder session stores to the given state.
    *
    * @param {import('#runtime/svelte/store/web-storage').WebStorage} storage -
    *
    * @param {object}   folder - Folder target.
    *
    * @param {boolean}  state - State to set.
    */
   static setChildState(storage, folder, state)
   {
      if (Array.isArray(folder?.children) && folder.children.length)
      {
         for (const childFolder of folder.children)
         {
            const storageKey = this.storageKey(childFolder);
            if (storage.hasStore(storageKey)) { storage.setItem(storageKey, state); }

            if (Array.isArray(childFolder?.children) && childFolder.children.length)
            {
               this.setChildState(storage, childFolder, state);
            }
         }
      }
   }

   /**
    * @param {object}   folder - Folder entry in tree structure.
    *
    * @returns {string} Session storage key for folder.
    */
   static storageKey(folder)
   {
      const id = this.#getDoc(folder)?.id;

      if (typeof id !== 'string') { throw new TypeError(`TreeControl.storageKey error: 'id' is not a string`); }

      return `${sessionConstants.folderState}.${id}`;
   }
}
