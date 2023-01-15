import { TJSDialog }          from '@typhonjs-fvtt/runtime/svelte/application';
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
         label: 'test',
         icon: 'fas fa-dice-d20',
         onPress: (item, options) =>
         {
            const dialog = new TJSDialog({
               // content: 'TEST',
               content: '<a tabindex=0>TEST</a>',
               title: 'Test',
               focusFirst: true,
               // default: 'but3',
               buttons: {
                  but1: {
                     icon: '<i class="fas fa-dice-d20"></i>',
                     label: 'But #1',
                     onPress: () => console.log('Click: button #1')
                  },
                  but2: {
                     icon: 'fas fa-trash fa-fw',
                     // label: 'bmd.menu.context-macro.delete-macro',
                     condition: () => true,
                     onPress: () => console.log('Click: button #2'),
                     styles: {
                        background: 'red',
                        flex: '0 fit-content'
                     },
                     title: 'Testing titles'
                  },
                  but3: {
                     icon: '<i class="fas fa-dice-d20"></i>',
                     label: 'But #3',
                     onPress: () => console.log('Click: button #3')
                  }
               }
            }, options).render(true, { force: true });

            // const dialog2 = new Dialog({
            //    content: 'TEST2',
            //    title: 'Test2',
            //    default: 'but3',
            //    buttons: {
            //       but1: {
            //          icon: '<i class="fas fa-dice-d20"></i>',
            //          label: 'But #1',
            //          callback: () => console.log('Click: button #1')
            //       },
            //       but3: {
            //          icon: '<i class="fas fa-dice-d20"></i>',
            //          label: 'But #2',
            //          callback: () => console.log('Click: button #2')
            //       }
            //    }
            // }, options).render(true, { force: true });
         }
      },
      {
         label: 'MACRO.Execute',
         icon: 'fas fa-dice-d20',
         onPress: (item, options) =>
         {
            macro.execute();
            A11yHelper.applyFocusOptions(options);
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
            A11yHelper.applyFocusOptions(options);
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
            A11yHelper.applyFocusOptions(options);
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
