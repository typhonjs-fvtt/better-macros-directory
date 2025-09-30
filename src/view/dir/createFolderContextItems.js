import { TJSDocumentDialog }  from '#standard/application/dialog/document';
import { localize }           from '#runtime/util/i18n';

/**
 * Creates the items for the context menu from the given document ID.
 *
 * @param {string}   documentId - Document ID to lookup
 *
 * @returns {import('#standard/component/menu').TJSMenuData.Items[]} Context menu items.
 */
export function createFolderContextItems(documentId)
{
   /**
    * @type {Folder}
    */
   const folder = game.folders.get(documentId);

   return [
      {
         label: 'FOLDER.Edit',
         icon: 'fas fa-edit',
         condition: () => game.user.isGM,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderUpdate(folder, { focusSource })
      },
      {
         label: 'FOLDER.CreateTable',
         icon: `${CONFIG.RollTable.sidebarIcon}`,
         condition: () => game.user.isGM && CONST.COMPENDIUM_DOCUMENT_TYPES.includes(folder.type),
         onPress: ({ focusSource }) => TJSDocumentDialog.folderRolltable(folder, { focusSource })
      },
      {
         label: 'FOLDER.Remove',
         icon: 'fas fa-trash',
         condition: () => game.user.isGM,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderRemove(folder, { focusSource })
      },
      {
         label: 'FOLDER.Delete',
         icon: 'fas fa-dumpster',
         condition: () => game.user.isGM,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderDelete(folder, { focusSource })
      },
      {
         label: 'OWNERSHIP.Configure',
         icon: 'fa-fw fa-solid fa-file-lock',
         condition: () => game.user.isGM,
         onPress: ({ focusSource }) => TJSDocumentDialog.configureOwnership(folder, { focusSource })
      },
      {
         label: 'FOLDER.Export',
         icon: 'fas fa-atlas',
         condition: () => game.user.isGM && CONST.COMPENDIUM_DOCUMENT_TYPES.includes(folder.type),
         onPress: ({ focusSource }) => TJSDocumentDialog.folderExport(folder, { focusSource })
      },

      {
         condition: () => game.user.isGM,
         separator: 'hr'
      },
      {
         label: localize('SIDEBAR.Create', { type: localize(Macro.metadata.label) }),
         icon: 'fas fa-code',
         onPress: ({ focusSource }) => TJSDocumentDialog.documentCreate(Macro, { folder: folder.id }, { focusSource })
      },
      {
         label: 'SIDEBAR.ACTIONS.CREATE.Folder',
         icon: 'fas fa-folder',
         condition: () => game.user.isGM,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderCreate({ folder: folder.id, type: 'Macro' },
          { focusSource })
      },
   ];
}
