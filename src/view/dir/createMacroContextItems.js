import { A11yHelper }         from '#runtime/util/a11y';

import { TJSDocumentDialog }  from '#standard/application/dialog/document';

import { MacroDoc }           from './MacroDoc.js';

import { sessionConstants }   from '#constants';

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
   const clickExec = eventbus.triggerSync('bmd:storage:session:item:get', sessionConstants.clickExec, false);

   /** @type {Macro} */
   const macro = game.macros.get(documentId);

   const items = [];

   // Add edit / open macro depending on click to execute state.
   if (clickExec)
   {
      items.push({
         label: 'MACRO.Edit',
         icon: 'fas fa-dice-d20',
         onPress: ({ focusSource }) =>
         {
            MacroDoc.open(documentId);
            A11yHelper.applyFocusSource(focusSource);
         }
      });
   }
   else
   {
      items.push({
         label: 'MACRO.Execute',
         icon: 'fas fa-dice-d20',
         onPress: ({ focusSource }) =>
         {
            MacroDoc.exec(documentId);
            A11yHelper.applyFocusSource(focusSource);
         }
      });
   }

   items.push(
      {
         label: 'OWNERSHIP.Configure',
         icon: 'fa-fw fa-solid fa-file-lock',
         condition: () => game.user.isGM,
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
         condition: () => game.user.isGM,
         onPress: ({ focusSource }) => TJSDocumentDialog.importFromJSON(macro, { focusSource })
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
      }
   );

   return items;
}
