<script>
   import { TJSContextMenu }           from '#standard/application/menu';
   import { TJSIconFolder }            from '#standard/component/folder';

   import { createFolderContextItems } from './createFolderContextItems.js';
   import FolderContent                from './FolderContent.svelte';

   import { constants }                from '#constants';

   /** @type {Folder} */
   export let folder;

   const folderProps = {
      iconClosed: 'fas fa-folder',
      iconOpen: 'fas fa-folder-open',
      onContextMenu: ({ event }) => TJSContextMenu.create({
         id: 'better-macros-directory-context-menu',
         items: createFolderContextItems(folder?.folder?.id),
         focusEl: constants.appId,
         event
      }),
      options: { focusIndicator: true }
   }

   let styles;

   $:
   {
      // The foundry create / edit folder dialog can set the color to an empty string, so check for that.
      const background = typeof folder?.folder?.color === 'string' && folder.folder.color.length ?
       folder.folder.color : void 0;

      // TJSFolder background; --bmd-folder-closed & open defined in Sass.
      styles = {
         '--tjs-folder-summary-background': background ?? 'var(--bmd-folder-background-closed)',
         '--tjs-folder-summary-background-open': background ?? 'var(--bmd-folder-background-open)',
      };
   }
</script>

<TJSIconFolder label={folder?.folder?.name} {...folderProps} {styles}>
{#each folder.children as folder (folder?.folder?.id)}
   <svelte:self {folder}/>
{/each}
<FolderContent content={folder.documentStore} />
</TJSIconFolder>
