<script>
   import { getContext }            from 'svelte';
   import { quintOut }              from 'svelte/easing';
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

   const searchInput = {
      store: $tree.filterSearch,
      efx: rippleFocus(),
      placeholder: 'bmd.form.search-macros',
      styles: { '--tjs-input-text-align': 'center' }
   };

   const alphaSortButton = {
      store: $tree.sortAlpha,
      icon: 'fas fa-sort-alpha-down',
      efx: ripple(),
      styles: { 'margin-left': '4px' }
   };

   const overflowMenu = {
      icon: 'fas fa-ellipsis-v',
      efx: ripple(),
      styles: { 'margin-left': '4px' }
   };

   let folderStyles;
   let fontSize;
   let itemHeight = 20;

   // A very fun use of Svelte easing / quintOut to modify font-size reactively from 1 to 1.25em.
   // `folderStyles` adjusts the CSS var that is attached to the chevron of the child folders.
   $: {
      fontSize = `${1 + (quintOut((itemHeight - 20) / 30 ) * 0.25)}em`;
      folderStyles = { '--tjs-summary-font-size': fontSize };
   }
</script>

<section class=top-bar>
   {#if $tree.isGM}
      <TJSSelect select={$tree.userSelect} efx={rippleFocus()} styles={{'margin-right': '4px'}}/>
   {/if}
   <TJSInput input={searchInput}/>
   <TJSToggleIconButton button={alphaSortButton}/>
   <TJSToggleIconButton button={overflowMenu}>
      <TJSMenu menu={{ items: createOverflowItems(eventbus), offset:{ y: 4 } }}>
         <span slot=after>
            <input type=range bind:value={itemHeight} min=20 max=50>
         </span>
      </TJSMenu>
   </TJSToggleIconButton>
</section>

<div class=container use:storeScrolltop={storeScroll}>
   <section class="directory flexcol"
            style:font-size={fontSize}
            style:--sidebar-item-height={`${itemHeight}px`}>
      <ol class=directory-list>
         {#each $tree.children as folder (folder.id)}
            <Folder {folder} styles={folderStyles}/>
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