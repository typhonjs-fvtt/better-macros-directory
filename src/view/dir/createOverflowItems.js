import { localize }           from '#runtime/util/i18n';

import { TJSDocumentDialog }  from '#standard/application/dialog/document';

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
         onPress: ({ focusSource }) => TJSDocumentDialog.documentCreate(Macro, {}, { focusSource })
      },
      {
         label: 'SIDEBAR.ACTIONS.CREATE.Folder',
         icon: 'fas fa-folder',
         onPress: ({ focusSource }) => TJSDocumentDialog.folderCreate({ type: 'Macro' }, { focusSource })
      },
      { label: 'bmd.menu.overflow.always-on-top', icon: 'fas fa-arrow-alt-circle-up' },
      { separator: 'hr' }
   ];
}
