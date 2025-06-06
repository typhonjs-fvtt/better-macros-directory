<script>
   import { getContext }               from 'svelte';

   import { TJSContextMenu }           from '#standard/application/menu';
   import { TJSIconFolder }            from '#standard/component/folder';

   import { createFolderContextItems } from './createFolderContextItems.js';
   import FolderContent                from './FolderContent.svelte';

   import { TreeControl }              from './TreeControl.js';

   import { constants }                from '#constants';

   /** @type {Folder} */
   export let folder;

   /** @type {import('#runtime/svelte/application').SvelteApp.Context.External} */
   const { application } = getContext('#external');

   const webStorage = application.reactive.sessionStorage;

   const folderProps = {
      label: folder?.folder?.name,
      iconClosed: 'fas fa-folder',
      iconOpen: 'fas fa-folder-open',
      onContextMenu: ({ event }) => TJSContextMenu.create({
         id: 'better-macros-directory-context-menu',
         items: createFolderContextItems(folder.folder.id),
         focusEl: constants.appId,
         event
      }),
      options: { focusIndicator: true },
      store: webStorage.getStore(TreeControl.storageKey(folder), false)
   }

   let styles;

   $:
   {
      // The foundry create / edit folder dialog can set the color to an empty string, so check for that.
      const color = folder?.folder?.color?.css;

      const background = typeof color === 'string' && color.length ? color : void 0;

      // TJSIconFolder background; --bmd-folder-background-closed defined in Sass.
      styles = {
         '--tjs-folder-summary-background': background ?? 'var(--bmd-folder-background)'
      };
   }

   /**
    * Handle closing all child folders if the `Alt` key is pressed when this folder is closed.
    *
    * @param {{ event: MouseEvent | KeyboardEvent }} data - On close data.
    */
   function onClose(data)
   {
      if (data?.event?.altKey) { TreeControl.setChildState(webStorage, folder, false); }
   }

   /**
    * Handle opening all child folders if the `Alt` key is pressed when this folder is opened.
    *
    * @param {{ event: MouseEvent | KeyboardEvent }} data - On open data.
    */
   function onOpen(data)
   {
      if (data?.event?.altKey) { TreeControl.setChildState(webStorage, folder, true); }
   }
// <TJSIconFolder label={folder?.folder?.name} {onClose} {onOpen} {...folderProps} {styles}>
</script>

<TJSIconFolder folder={folderProps} {onClose} {onOpen} {styles}>
{#each folder.children as folder (folder?.folder?.id)}
   <svelte:self {folder}/>
{/each}
<FolderContent content={folder.documentStore} />
</TJSIconFolder>
