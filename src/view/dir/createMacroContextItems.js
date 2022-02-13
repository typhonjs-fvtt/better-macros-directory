import { TJSDocumentDialog }  from '@typhonjs-fvtt/runtime/svelte/application/dialog';

import { TJSDialog }  from '@typhonjs-fvtt/runtime/svelte/application';

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
         label: 'test',
         icon: 'fas fa-dice-d20',
         onclick: () =>
         {
            const dialog = new TJSDialog({
               content: 'TEST',
               title: 'Test',
               buttons: {
                  but1: {
                     icon: '<i class="fas fa-dice-d20"></i>',
                     label: 'But #1',
                     onclick: () => console.log('Click: button #1')
                  },
                  but2: {
                     icon: 'fas fa-trash fa-fw',
                     // label: 'bmd.menu.context-macro.delete-macro',
                     condition: () => true,
                     onclick: () => console.log('Click: button #2'),
                     styles: {
                        background: 'red',
                        flex: '0 fit-content'
                     },
                     title: 'Testing titles'
                  },
                  but3: {
                     icon: '<i class="fas fa-dice-d20"></i>',
                     label: 'But #3',
                     onclick: () => console.log('Click: button #3')
                  }
               }
            }).render(true, { force: true });
         }
      },
      {
         label: 'MACRO.Execute',
         icon: 'fas fa-dice-d20',
         onclick: () => macro.execute()
      },
      {
         label: 'SIDEBAR.Delete',
         icon: 'fas fa-trash fa-fw',
         condition: () => game.user.isGM || macro.isOwner,
         onclick: () => TJSDocumentDialog.documentDelete(macro)
      },
      {
         label: 'SIDEBAR.Duplicate',
         icon: 'fas fa-copy fa-fw',
         condition: () => game.user.isGM || macro.isOwner,
         onclick: () => macro.clone({ name: `${macro.name} (Copy)` }, { save: true })
      },
      {
         label: 'PERMISSION.Configure',
         icon: 'fas fa-lock fa-fw',
         onclick: () => TJSDocumentDialog.configurePermissions(macro)
      },
      {
         label: 'SIDEBAR.Export',
         icon: 'fas fa-file-export fa-fw',
         condition: () => macro.isOwner,
         onclick: () => macro.exportToJSON()
      },
      {
         label: 'SIDEBAR.Import',
         icon: 'fas fa-file-import fa-fw',
         condition: () => macro.isOwner,
         onclick: () => TJSDocumentDialog.importFromJSON(macro)
      }
   ];
}
