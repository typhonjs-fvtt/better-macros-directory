import { TJSDocumentDialog }  from '#runtime/svelte/application/dialog';
import { localize }           from '#runtime/svelte/helper';

/**
 * Creates the items for the overflow menu.
 *
 * @param {object}   eventbus - Plugin eventbus
 *
 * @returns {Iterable<object>} Overflow menu items.
 */
export function createOverflowItems(eventbus) // eslint-disable-line no-unused-vars
{
   return [
      {
         label: localize('SIDEBAR.Create', { type: localize(Macro.metadata.label) }),
         icon: 'fas fa-code',
         onPress: (item, options) => TJSDocumentDialog.documentCreate(Macro, {}, options)
      },
      {
         label: 'FOLDER.Create',
         icon: 'fas fa-folder',
         onPress: (item, options) => TJSDocumentDialog.folderCreate({ type: 'Macro' }, options)
      },
      { label: 'bmd.menu.overflow.always-on-top', icon: 'fas fa-arrow-alt-circle-up' },
      { separator: 'hr' }
   ];
}
