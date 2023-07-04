<script>
   import { getContext }            from 'svelte';
   import { quadIn }                from 'svelte/easing';

   import { applyStyles }           from '#runtime/svelte/action/dom';
   import { localize }              from '#runtime/svelte/helper';
   import { gameState }             from '#runtime/svelte/store/fvtt';

   import {
      ripple,
      rippleFocus }                 from '#runtime/svelte/action/animate';

   import {
      TJSInput,
      TJSMenu,
      TJSScrollContainer,
      TJSSelect,
      TJSToggleIconButton }         from '#standard/component';

   import { createOverflowItems }   from './createOverflowItems.js';
   import Folder                    from './Folder.svelte';
   import FolderContent             from './FolderContent.svelte';

   import { constants, sessionConstants } from "#constants";

   const eventbus = getContext('#external').eventbus;

   const tree = eventbus.triggerSync('bmd:data:macros:directory:get');

   const storeMenuScale = eventbus.triggerSync('bmd:storage:session:store:get', sessionConstants.menuScale, 200);

   const searchInput = {
      type: 'search',
      store: $tree.filterSearch,
      efx: rippleFocus(),
      placeholder: localize('SIDEBAR.Search', { types: localize('DOCUMENT.Macros') }),
      styles: { '--tjs-input-text-align': 'center' }
   };

   const alphaSortButton = {
      store: $tree.sortAlpha,
      icon: 'fas fa-sort-alpha-down',
      efx: ripple()
   };

   const overflowMenu = {
      icon: 'fas fa-ellipsis-v',
      efx: ripple()
   };

   const storeSelect = $tree.userSelect.store;

   let storeScroll;

   $: {
      const sessionKey = `${sessionConstants.scrolltopPartial}${!game.user.isGM ? 'player' : `gm-${$storeSelect}`}`;
      storeScroll = eventbus.triggerSync('bmd:storage:session:store:get', sessionKey, 0);
   }

   // `folderStyles` adjusts the CSS var that is attached to the chevron of the child folders.
   // `fontSize` is inherited through the folder / folder contents section.
   let folderStyles;
   let fontSize;

   // `itemHeightQuad` is an eased value applied to the Foundry CSS var `--sidebar-item-height`.
   let itemHeightQuad;

   // A very fun use of Svelte easing / quintOut to modify font-size reactively from 1 to 1.25em using quad in easing.
   // This gives a very natural feeling when increasing / decreasing the elements displayed.
   // see https://svelte.dev/repl/easing?version=3.46.3 and select 'quad' & 'ease in' to see the curve applied.
   $: {
      const adjustedItemHeight = $storeMenuScale / 10;
      const easing = quadIn((adjustedItemHeight - 20) / 30 );
      fontSize = `${1 + (easing * 0.25)}em`;
      folderStyles = { '--tjs-folder-summary-font-size': fontSize };
      itemHeightQuad = `${20 + (easing * 30)}px`;
   }
</script>

<section class=bmd-top-bar>
   {#if $gameState.user.isGM}
      <TJSSelect select={$tree.userSelect} efx={rippleFocus()}/>
   {/if}
   <TJSInput input={searchInput}/>
   <TJSToggleIconButton button={alphaSortButton}/>
   <TJSToggleIconButton button={overflowMenu}>
      <TJSMenu menu={{ items: createOverflowItems(eventbus), offset: { y: 4 }, focusEl: constants.appId }}>
         <div class=range
              slot=after
              on:click|preventDefault|stopPropagation={() => null}
              role=presentation>
            Scale: <input type=range bind:value={$storeMenuScale} min=200 max=500 step=1>
         </div>
      </TJSMenu>
   </TJSToggleIconButton>
</section>

<TJSScrollContainer scrollTop={storeScroll}>
   <section class="directory flexcol"
            style:font-size={fontSize}
            style:--sidebar-item-height={itemHeightQuad}>
      <ol class=directory-list use:applyStyles={folderStyles}>
         {#each $tree.children as folder (folder.folder.id)}
            <Folder {folder} />
         {/each}
         <FolderContent content={$tree.documentStore} />
      </ol>
   </section>
</TJSScrollContainer>

<style lang=scss>
   .directory-list {
      --tjs-folder-summary-border-width: 0 0 2px 0;
      --tjs-folder-summary-border-radius: 0 0 0 0.25em;
      --tjs-folder-summary-gap: 2px;
      --tjs-folder-summary-width: 100%;

      --tjs-folder-summary-outline-focus-visible: none;
      --tjs-folder-summary-focus-indicator-color: white;
      --tjs-folder-summary-focus-indicator-width: 4px;
   }

   .bmd-top-bar {
      display: flex;
      padding: 4px;
      gap: 4px;
      flex: 1 1 20px;
      justify-content: center;
      border-bottom: solid 1px #444;
   }

   .range {
      display: flex;
      padding: 0 0.5em;
      width: 110px;
      gap: 4px;
      font-size: 0.8em;
      justify-content: center;
      align-items: center;
   }

   .range input {
      width: 70%;
   }
</style>