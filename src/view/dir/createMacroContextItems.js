import { TJSDocumentDialog }  from '@typhonjs-fvtt/runtime/svelte/application';

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
         label: 'bmd.menu.context-macro.execute-macro',
         icon: 'fas fa-dice-d20',
         onclick: () => macro.execute()
      },
      {
         label: 'bmd.menu.context-macro.delete-macro',
         icon: 'fas fa-trash fa-fw',
         condition: () => game.user.isGM || macro.isOwner,
         onclick: () => TJSDocumentDialog.deleteDocument(macro)
      },
      {
         label: 'bmd.menu.context-macro.duplicate-macro',
         icon: 'fas fa-copy fa-fw',
         condition: () => game.user.isGM || macro.isOwner,
         onclick: () => macro.clone({ name: `${macro.name} (Copy)` }, { save: true })
      },
      {
         label: 'bmd.menu.context-macro.configure-permissions',
         icon: 'fas fa-lock fa-fw',
         onclick: () => TJSDocumentDialog.configurePermissions(macro)
      },
      {
         label: 'bmd.menu.context-macro.export-data',
         icon: 'fas fa-file-export fa-fw',
         condition: () => macro.isOwner,
         onclick: () => macro.exportToJSON()
      },
      {
         label: 'bmd.menu.context-macro.import-data',
         icon: 'fas fa-file-import fa-fw',
         condition: () => macro.isOwner,
         onclick: () => TJSDocumentDialog.importFromJSON(macro)
      }
   ];
}
