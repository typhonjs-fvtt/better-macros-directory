<script>
   import { getContext }            from 'svelte';
   import { quadIn }                from 'svelte/easing';

   import { applyStyles }           from '#runtime/svelte/action/dom/style';

   import {
      ripple,
      rippleFocus }                 from '#standard/action/animate/composable';

   import { TJSToggleIconButton }   from '#standard/component/button';

   import {
      TJSInput,
      TJSInputRange,
      TJSSelect }                   from '#standard/component/form';

   import { TJSScrollContainer }    from '#standard/component/container';

   import { TJSMenu }               from '#standard/component/menu';

   import { createOverflowItems }   from './createOverflowItems.js';

   import Folder                    from './Folder.svelte';
   import FolderContent             from './FolderContent.svelte';

   import { constants, sessionConstants } from "#constants";

   const { application, eventbus } = getContext('#external');

   const storeAlwaysOnTop = application?.reactive?.storeAppOptions?.alwaysOnTop;

   const tree = eventbus.triggerSync('bmd:data:macros:directory:get');

   const storeMenuScale = eventbus.triggerSync('bmd:storage:session:store:get', sessionConstants.menuScale, 200);

   const searchInput = {
      type: 'search',
      store: $tree.filterSearch,
      efx: rippleFocus(),
      placeholder: 'FILES.Search',
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

   const scaleMenu = {
      efxNumber: rippleFocus(),
      label: 'Scale:',
      min: 200,
      max: 500,
      store: storeMenuScale,
   }

   const storeSelect = $tree.userSelect.store;

   /**
    * When embedded in an application, create the `alwaysOnTopFn` callback accessible in the context menu.
    *
    * @type {Function}
    */
   const alwaysOnTopFn = application ? () => $storeAlwaysOnTop = !$storeAlwaysOnTop : void 0;

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

   /**
    * Stop propagation of `<Alt>` key which is used to control open / close all folders.
    *
    * @param {KeyboardEvent} event - Keyboard event
    */
   function onKeydown(event)
   {
      if (event.altKey)
      {
         event.preventDefault();
         event.stopPropagation();
      }
   }
</script>

<section class=bmd-top-bar>
   {#if globalThis.game.user.isGM}
      <div class=gm-content>
         <TJSSelect select={$tree.userSelect} efx={rippleFocus()}/>
      </div>
   {/if}
   <TJSInput input={searchInput}/>
   <TJSToggleIconButton button={alphaSortButton}/>
   <TJSToggleIconButton button={overflowMenu}>
      <TJSMenu menu={{ items: createOverflowItems({ alwaysOnTopFn, alwaysOnTop: $storeAlwaysOnTop, eventbus }), offset: { y: 4 }, focusEl: constants.appId }}>
         <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
         <div class=range
              on:click|stopPropagation
              slot=after>
            <TJSInputRange input={scaleMenu} />
         </div>
      </TJSMenu>
   </TJSToggleIconButton>
</section>

<TJSScrollContainer scrollTop={storeScroll}>
   <!-- svelte-ignore a11y-no-static-element-interactions -->
   <section class="directory flexcol"
            style:font-size={fontSize}
            style:--sidebar-item-height={itemHeightQuad}
            on:keydown={onKeydown}>
      <ol class=directory-list use:applyStyles={folderStyles}>
         {#each $tree.children as folder (folder.folder.id)}
            {#if folder?.folder?.displayed}
               <Folder {folder} />
            {/if}
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

      padding: 0;
      margin: 0;
   }

   .bmd-top-bar {
      display: flex;
      padding: 4px;
      gap: 4px;
      justify-content: center;
      border-bottom: solid 1px #444;
      max-height: fit-content;
   }

   .gm-content {
      display: block;
      width: 100%;
   }

   // When the window content width is less than 250px remove the GM user select.
   @container tjs-app-window-content (0 <= width < 250px) {
      .gm-content {
         display: none;
      }
   }

   .range {
      --tjs-input-height: var(--tjs-menu-item-line-height);

      display: flex;
      width: 95px;
      font-size: 0.8em;
      justify-content: center;
      align-items: center;
   }
</style>
