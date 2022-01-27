<script>
   import { getContext }         from 'svelte';
   import { writable }           from 'svelte/store';

   import {
      ripple,
      rippleFocus,
      storeScrolltop }           from '@typhonjs-fvtt/svelte-standard/action';

   import {
      TJSInput,
      TJSMenu,
      TJSSelect,
      TJSToggleIconButton }      from '@typhonjs-fvtt/svelte-standard/component';

   import Folder                 from './Folder.svelte';
   import FolderContent          from './FolderContent.svelte';

   import { sessionConstants }   from "#constants";

   const eventbus = getContext('external').eventbus;

   const tree = eventbus.triggerSync('bmd:data:macro:directory:get');

   const storeScroll = writable(void 0);

   let itemHeight = 40;
</script>

<section class=top-bar>
   <input type=range bind:value={itemHeight} min=20 max=60>
</section>

<div class=container use:storeScrolltop={storeScroll}>
   <section class="directory flexcol" style:--sidebar-item-height={`${itemHeight}px`}>
      <ol class=directory-list>
         {#each $tree.children as folder (folder.id)}
            <Folder {folder}/>
         {/each}
         <FolderContent content={$tree.content} />
      </ol>
   </section>
</div>

<style>
   .top-bar {
      display: flex;
      padding: 4px;
      flex: 1 1 20px;
      justify-content: center;
   }

   .container {
      overflow-y: auto;
   }
</style>