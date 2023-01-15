import { TJSDocumentDialog }  from '@typhonjs-fvtt/runtime/svelte/application/dialog';

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
         onPress: (item, options) => TJSDocumentDialog.folderUpdate(folder, options)
      },
      {
         label: 'OWNERSHIP.Configure',
         icon: 'fas fa-lock fa-fw',
         condition: () => game.user.isGM || folder.isOwner,
         onPress: (item, options) => TJSDocumentDialog.configureOwnership(folder, options)
      },
      {
         label: 'FOLDER.Export',
         icon: 'fas fa-atlas',
         condition: () => CONST.COMPENDIUM_DOCUMENT_TYPES.includes(folder.type),
         onPress: async (item, options) => TJSDocumentDialog.folderExport(folder, options)
      },
      {
         label: 'FOLDER.CreateTable',
         icon: `${CONFIG.RollTable.sidebarIcon}`,
         condition: () => CONST.COMPENDIUM_DOCUMENT_TYPES.includes(folder.type),
         onPress: async (item, options) => TJSDocumentDialog.folderRolltable(folder, options)
      },
      {
         label: 'FOLDER.Remove',
         icon: 'fas fa-trash',
         condition: () => game.user.isGM || folder.isOwner,
         onPress: async (item, options) => TJSDocumentDialog.folderRemove(folder, options)
      },
      {
         label: 'FOLDER.Delete',
         icon: 'fas fa-dumpster',
         condition: () => game.user.isGM || folder.isOwner,
         onPress: async (item, options) => TJSDocumentDialog.folderDelete(folder, options)
      }
   ];
}
