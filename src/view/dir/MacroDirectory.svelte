<script>
   import { getContext }            from 'svelte';
   import { quadIn }               from 'svelte/easing';
   import { writable }              from 'svelte/store';

   import { gameState }             from '@typhonjs-fvtt/runtime/svelte/store';

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

   // `folderStyles` adjusts the CSS var that is attached to the chevron of the child folders.
   // `fontSize` is inherited through the folder / folder contents section.
   let folderStyles;
   let fontSize;

   // `itemHeight` is a linear value applied to the Foundry CSS var `--sidebar-item-height`.
   let itemHeight = 200;
   let itemHeightQuint;

   // A very fun use of Svelte easing / quintOut to modify font-size reactively from 1 to 1.25em using quad in easing.
   // This gives a very natural feeling when increasing / decreasing the elements displayed.
   // see https://svelte.dev/repl/easing?version=3.46.3 and select 'quad' & 'ease in' to see the curve applied.
   $: {
      const adjustedItemHeight = itemHeight / 10;
      const easing = quadIn((adjustedItemHeight - 20) / 30 );
      fontSize = `${1 + (easing * 0.25)}em`;
      folderStyles = { '--tjs-summary-font-size': fontSize };
      itemHeightQuint = `${20 + (easing * 30)}px`;
   }
</script>

<section class=top-bar>
   {#if $gameState.user.isGM}
      <TJSSelect select={$tree.userSelect} efx={rippleFocus()} styles={{'margin-right': '4px'}}/>
   {/if}
   <TJSInput input={searchInput}/>
   <TJSToggleIconButton button={alphaSortButton}/>
   <TJSToggleIconButton button={overflowMenu}>
      <TJSMenu menu={{ items: createOverflowItems(eventbus), offset:{ y: 4 } }}>
         <div slot=after>
            <hr>
            <div class=range>Scale: <input type=range bind:value={itemHeight} min=200 max=500></div>
         </div>
      </TJSMenu>
   </TJSToggleIconButton>
</section>

<div class=container use:storeScrolltop={storeScroll}>
   <section class="directory flexcol"
            style:font-size={fontSize}
            style:--sidebar-item-height={itemHeightQuint}>
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
      border-bottom: solid 1px #444;
   }

   div.range {
      display: flex;
      padding: 0 0.5em;
      max-width: fit-content;
      font-size: 0.8em;
      justify-content: center;
      align-items: center;
   }

   div.range input {
      width: 70%;
      margin-left: 4px;
   }

   hr {
      border-top: 1px solid #444;
      border-bottom: none;
      margin: 2px;
   }

   .container {
      overflow-y: auto;
   }
</style>