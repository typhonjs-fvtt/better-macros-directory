import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

export function createMacroContextItems(eventbus, documentId)
{
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
         onclick: () =>
         {
            const type = game.i18n.localize(Macro.metadata.label);
            return TJSDialog.confirm({
               modal: true,
               draggable: false,
               title: `${game.i18n.format("DOCUMENT.Delete", {type})}: ${macro.name}`,
               content: `<h4>${game.i18n.localize("AreYouSure")}</h4><p>${game.i18n.format("SIDEBAR.DeleteWarning", 
                {type})}</p>`,
               yes: macro.delete.bind(macro)
            });
         }
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
         onclick: () => console.log('ITEM 1 Selected')
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
         onclick: () => macro.importFromJSONDialog()
      }
   ];
}
