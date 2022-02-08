<script>
   import { TJSContextMenu }           from '@typhonjs-fvtt/svelte-standard/application';
   import { TJSIconFolder }            from '@typhonjs-fvtt/svelte-standard/component';

   import { createFolderContextItems } from './createFolderContextItems.js';
   import FolderContent                from './FolderContent.svelte';

   /** @type {Folder} */
   export let folder;

   const folderProps = {
      iconClosed: 'fas fa-folder',
      iconOpen: 'fas fa-folder-open',
      onContextMenu: (event) => TJSContextMenu.create({
         x: event.pageX,
         y: event.pageY,
         items: createFolderContextItems(folder.id)
      })
   }

   let styles;

   $:
   {
      // The foundry create / edit folder dialog can set the color to an empty string, so check for that.
      const background = typeof folder.data.color === 'string' && folder.data.color.length ? folder.data.color : void 0;

      // TJSFolder background; --bmd-folder-closed & open defined in Sass.
      styles = {
         '--tjs-summary-background': background ?? 'var(--bmd-folder-background-closed)',
         '--tjs-summary-background-open': background ?? 'var(--bmd-folder-background-open)',
      };
   }
</script>

<TJSIconFolder label={folder.data.name} {...folderProps} {styles}>
{#each folder.children as folder (folder.id)}
   <svelte:self {folder}/>
{/each}
<FolderContent content={folder.contentStore} />
</TJSIconFolder>
