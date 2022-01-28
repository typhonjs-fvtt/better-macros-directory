<script>
   import { getContext }            from 'svelte';
   import { writable }              from 'svelte/store';

   import {
      ripple,
      rippleFocus,
      storeScrolltop }              from '@typhonjs-fvtt/svelte-standard/action';

   import {
      TJSInput,
      TJSMenu,
      TJSSelect,
      TJSToggleIconButton }         from '@typhonjs-fvtt/svelte-standard/component';

   import { createOverflowItems }   from './createOverflowItems.js';
   import Folder                    from './Folder.svelte';
   import FolderContent             from './FolderContent.svelte';

   import { sessionConstants }   from "#constants";

   const eventbus = getContext('external').eventbus;

   const tree = eventbus.triggerSync('bmd:data:macro:directory:get');

   const storeScroll = writable(void 0);

   const alphaSortButton = {
      store: $tree.sortAlpha,
      icon: 'fas fa-sort-alpha-down',
      efx: ripple(),
      styles: { 'margin-left': '8px' }
   };

   const overflowMenu = {
      icon: 'fas fa-ellipsis-v',
      efx: ripple(),
      styles: { 'margin-left': '8px' }
   };

   let itemHeight = 20;
</script>

<section class=top-bar>
<!--   <TJSSelect select={$tree.userSelect} efx={rippleFocus()}/>-->
   <TJSInput input={{ store: $tree.filterSearch, efx: rippleFocus() }}/>
   <TJSToggleIconButton button={alphaSortButton}/>
   <TJSToggleIconButton button={overflowMenu}>
      <TJSMenu menu={{ items: createOverflowItems(eventbus), offset:{ y: 4 } }} />
   </TJSToggleIconButton>

   <!--   <input type=range bind:value={itemHeight} min=20 max=60>-->
</section>

<div class=container use:storeScrolltop={storeScroll}>
   <section class="directory flexcol" style:--sidebar-item-height={`${itemHeight}px`}>
      <ol class=directory-list>
         {#each $tree.children as folder (folder.id)}
            <Folder {folder}/>
         {/each}
         <FolderContent content={$tree.contentStore} />
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