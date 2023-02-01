import { TJSDocumentDialog }  from '@typhonjs-fvtt/runtime/svelte/application/dialog';
import { A11yHelper }         from '@typhonjs-fvtt/runtime/svelte/util';

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
         onPress: (item, options) =>
         {
            macro.execute();
            A11yHelper.applyFocusSource(options);
         }
      },
      {
         label: 'SIDEBAR.Delete',
         icon: 'fas fa-trash fa-fw',
         condition: () => game.user.isGM || macro.isOwner,
         onPress: (item, options) => TJSDocumentDialog.documentDelete(macro, options)
      },
      {
         label: 'SIDEBAR.Duplicate',
         icon: 'fas fa-copy fa-fw',
         condition: () => game.user.isGM || macro.isOwner,
         onPress: (item, options) =>
         {
            macro.clone({ name: `${macro.name} (Copy)` }, { save: true });
            A11yHelper.applyFocusSource(options);
         }
      },
      {
         label: 'OWNERSHIP.Configure',
         icon: 'fas fa-lock fa-fw',
         onPress: (item, options) => TJSDocumentDialog.configureOwnership(macro, options)
      },
      {
         label: 'SIDEBAR.Export',
         icon: 'fas fa-file-export fa-fw',
         condition: () => macro.isOwner,
         onPress: (item, options) =>
         {
            macro.exportToJSON();
            A11yHelper.applyFocusSource(options);
         }
      },
      {
         label: 'SIDEBAR.Import',
         icon: 'fas fa-file-import fa-fw',
         condition: () => macro.isOwner,
         onPress: (item, options) => TJSDocumentDialog.importFromJSON(macro, options)
      }
   ];
}
