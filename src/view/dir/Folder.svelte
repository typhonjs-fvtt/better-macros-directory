<script>
   import { getContext }               from 'svelte';

   import { TJSContextMenu }           from '#standard/application/menu';
   import { TJSIconFolder }            from '#standard/component/folder';

   import { createFolderContextItems } from './createFolderContextItems.js';
   import FolderContent                from './FolderContent.svelte';

   import {
      constants,
      sessionConstants }               from '#constants';

   /** @type {Folder} */
   export let folder;

   /** @type {import('#runtime/svelte/application').SvelteApp.Context.External} */
   const { application } = getContext('#external');

   const folderProps = {
      iconClosed: 'fas fa-folder',
      iconOpen: 'fas fa-folder-open',
      onContextMenu: ({ event }) => TJSContextMenu.create({
         id: 'better-macros-directory-context-menu',
         items: createFolderContextItems(folder.folder.id),
         focusEl: constants.appId,
         event
      }),
      options: { focusIndicator: true },
      store: application.reactive.sessionStorage.getStore(`${sessionConstants.folderState}.${folder.folder.id}`, false)
   }

   let styles;

   $:
   {
      // The foundry create / edit folder dialog can set the color to an empty string, so check for that.
      const color = folder?.folder?.color?.css;

      const background = typeof color === 'string' && color.length ? color : void 0;

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
