import { A11yHelper }         from '#runtime/util/a11y';

import { TJSDocumentDialog }  from '#standard/application/dialog/document';

/**
 * Creates the items for the context menu from the given document ID.
 *
 * @param {object}   eventbus - Plugin eventbus
 *
 * @param {string}   documentId - Document ID to lookup
 *
 * @returns {object[]} Context menu items.
 */
export function createMacroContextItems(eventbus, documentId)
{
   /**
    * @type {Macro}
    */
   const macro = game.macros.get(documentId);

   return [
      {
         label: 'MACRO.Execute',
         icon: 'fas fa-dice-d20',
         onPress: ({ focusSource }) =>
         {
            macro.execute();
            A11yHelper.applyFocusSource(focusSource);
         }
      },
      {
         label: 'SIDEBAR.Delete',
         icon: 'fas fa-trash fa-fw',
         condition: () => game.user.isGM || macro.isOwner,
         onPress: ({ focusSource }) => TJSDocumentDialog.documentDelete(macro, { focusSource })
      },
      {
         label: 'SIDEBAR.Duplicate',
         icon: 'fas fa-copy fa-fw',
         condition: () => game.user.isGM || macro.isOwner,
         onPress: ({ focusSource }) =>
         {
            macro.clone({ name: `${macro.name} (Copy)` }, { save: true });
            A11yHelper.applyFocusSource(focusSource);
         }
      },
      {
         label: 'OWNERSHIP.Configure',
         icon: 'fas fa-lock fa-fw',
         onPress: ({ focusSource }) => TJSDocumentDialog.configureOwnership(macro, { focusSource })
      },
      {
         label: 'SIDEBAR.Export',
         icon: 'fas fa-file-export fa-fw',
         condition: () => macro.isOwner,
         onPress: ({ focusSource }) =>
         {
            macro.exportToJSON();
            A11yHelper.applyFocusSource(focusSource);
         }
      },
      {
         label: 'SIDEBAR.Import',
         icon: 'fas fa-file-import fa-fw',
         condition: () => macro.isOwner,
         onPress: ({ focusSource }) => TJSDocumentDialog.importFromJSON(macro, { focusSource })
      }
   ];
}
