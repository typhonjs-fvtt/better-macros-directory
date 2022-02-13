import { TJSDocumentDialog }  from '@typhonjs-fvtt/runtime/svelte/application/dialog';
import { localize }           from '@typhonjs-fvtt/runtime/svelte/helper';

/**
 * Creates the items for the overflow menu.
 *
 * @param {object}   eventbus - Plugin eventbus
 *
 * @returns {object[]} Overflow menu items.
 */
export function createOverflowItems(eventbus) // eslint-disable-line no-unused-vars
{
   return [
      {
         label: localize('SIDEBAR.Create', { type: localize(Macro.metadata.label) }),
         icon: 'fas fa-code',
         onclick: () => TJSDocumentDialog.documentCreate(Macro)
      },
      {
         label: 'FOLDER.Create',
         icon: 'fas fa-folder',
         onclick: () => TJSDocumentDialog.folderCreate({ type: 'Macro' })
      },
      { label: 'bmd.menu.overflow.always-on-top', icon: 'fas fa-arrow-alt-circle-up' }
   ];
}
