import { TJSDocumentDialog }  from '#standard/application/dialog/document';

/**
 * Creates the items for the context menu from the given document ID.
 *
 * @param {string}   documentId - Document ID to lookup
 *
 * @returns {object[]} Context menu items.
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
         condition: () => game.user.isGM || folder.isOwner,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderUpdate(folder, { focusSource })
      },
      {
         label: 'FOLDER.CreateTable',
         icon: `${CONFIG.RollTable.sidebarIcon}`,
         condition: () => CONST.COMPENDIUM_DOCUMENT_TYPES.includes(folder.type),
         onPress: ({ focusSource }) => TJSDocumentDialog.folderRolltable(folder, { focusSource })
      },
      {
         label: 'FOLDER.Remove',
         icon: 'fas fa-trash',
         condition: () => game.user.isGM || folder.isOwner,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderRemove(folder, { focusSource })
      },
      {
         label: 'FOLDER.Delete',
         icon: 'fas fa-dumpster',
         condition: () => game.user.isGM || folder.isOwner,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderDelete(folder, { focusSource })
      },
      {
         label: 'OWNERSHIP.Configure',
         icon: 'fas fa-lock fa-fw',
         condition: () => game.user.isGM || folder.isOwner,
         onPress: ({ focusSource }) => TJSDocumentDialog.configureOwnership(folder, { focusSource })
      },
      {
         label: 'FOLDER.Export',
         icon: 'fas fa-atlas',
         condition: () => CONST.COMPENDIUM_DOCUMENT_TYPES.includes(folder.type),
         onPress: ({ focusSource }) => TJSDocumentDialog.folderExport(folder, { focusSource })
      }
   ];
}
