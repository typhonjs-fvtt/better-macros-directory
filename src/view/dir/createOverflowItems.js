import { localize }           from '#runtime/util/i18n';

import { TJSDocumentDialog }  from '#standard/application/dialog/document';

/**
 * Creates the items for the overflow menu.
 *
 * @param {Function}   [alwaysOnTopFn] - Always on top.
 *
 * @returns {Iterable<object>} Overflow menu items.
 */
export function createOverflowItems({ alwaysTopFn, alwaysTopValue } = {}) // eslint-disable-line no-unused-vars
{
   const items = [
      {
         label: localize('SIDEBAR.Create', { type: localize(Macro.metadata.label) }),
         icon: 'fas fa-code',
         onPress: ({ focusSource }) => TJSDocumentDialog.documentCreate(Macro, {}, { focusSource })
      },
      {
         label: 'SIDEBAR.ACTIONS.CREATE.Folder',
         icon: 'fas fa-folder',
         condition: () => game.user.isGM,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderCreate({ type: 'Macro' }, { focusSource })
      }
   ];

   // Only add `always on top` option when `alwaysTopFn` is defined.
   if (typeof alwaysTopFn === 'function')
   {
      items.push({
         label: 'bmd.menu.overflow.always-on-top',
         icon: `fas fa-arrow-alt-circle-${alwaysTopValue ? 'down' : 'up'}`,
         onPress: alwaysTopFn
      });
   }

   items.push({ separator: 'hr' });

   return items;
}
