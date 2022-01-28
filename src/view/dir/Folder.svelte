<script>
   import { TJSFolder }       from '@typhonjs-fvtt/svelte-standard/component';

   import FolderContent       from './FolderContent.svelte';

   export let folder;
   export let styles;
</script>

<TJSFolder label={folder.data.name} {styles}>
{#each folder.children as folder (folder.id)}
   <svelte:self {folder}/>
{/each}
<FolderContent content={folder.contentStore} />
</TJSFolder>
