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
         onclick: () => TJSDocumentDialog.folderUpdate(folder)
      },
      {
         label: 'OWNERSHIP.Configure',
         icon: 'fas fa-lock fa-fw',
         condition: () => game.user.isGM || folder.isOwner,
         onclick: () => TJSDocumentDialog.configureOwnership(folder)
      },
      {
         label: 'FOLDER.Export',
         icon: 'fas fa-atlas',
         condition: () => CONST.COMPENDIUM_DOCUMENT_TYPES.includes(folder.type),
         onclick: async () => TJSDocumentDialog.folderExport(folder)
      },
      {
         label: 'FOLDER.CreateTable',
         icon: `${CONFIG.RollTable.sidebarIcon}`,
         condition: () => CONST.COMPENDIUM_DOCUMENT_TYPES.includes(folder.type),
         onclick: async () => TJSDocumentDialog.folderRolltable(folder)
      },
      {
         label: 'FOLDER.Remove',
         icon: 'fas fa-trash',
         condition: () => game.user.isGM || folder.isOwner,
         onclick: async () => TJSDocumentDialog.folderRemove(folder)
      },
      {
         label: 'FOLDER.Delete',
         icon: 'fas fa-dumpster',
         condition: () => game.user.isGM || folder.isOwner,
         onclick: async () => TJSDocumentDialog.folderDelete(folder)
      }
   ];
}
