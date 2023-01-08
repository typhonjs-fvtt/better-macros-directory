<script>
   import { getContext }               from 'svelte';
   import { TJSContextMenu }           from '@typhonjs-fvtt/svelte-standard/application';

   import { createMacroContextItems }  from './createMacroContextItems.js';

   export let content;

   const eventbus = getContext('external').eventbus;

   function onPress(documentId)
   {
      const sheet = game.macros.get(documentId)?.sheet;

      if (!sheet) { return; }

      // If the sheet is already rendered:
      if (sheet.rendered)
      {
         sheet.bringToTop();
         return sheet.maximize();
      }
      // Otherwise render the sheet
      else
      {
         sheet.render(true);
      }
   }

   function onContextMenu(event, documentId)
   {
console.log(`!! FolderContent - onContextMenu - event: `, event);

      TJSContextMenu.create({ x: event.pageX, y: event.pageY, items: createMacroContextItems(eventbus, documentId)});
   }

   function onContextPress(event, documentId)
   {
      if (event.target instanceof HTMLElement)
      {
         const rect = event.target.getBoundingClientRect();
         const x = rect.left + (rect.width / 2);
         const y = rect.top + (rect.height / 2);

         TJSContextMenu.create({ x, y, items: createMacroContextItems(eventbus, documentId)});
      }

      event.preventDefault();
      event.stopPropagation();
   }

   function onKeydown(event)
   {
      switch (event.code)
      {
         case 'Enter':
         // case 'ContextMenu':
         // case 'F10':
            event.stopPropagation();
            break;
      }
   }

   function onKeyup(event, documentId)
   {
      switch (event.code)
      {
         case 'Enter':
            event.stopPropagation();
            onPress(documentId);
            break;

         // case 'ContextMenu':
         //    onContextPress(event, documentId);
         //    break;
         //
         // // Support Windows context menu key combo - <Shift-F10>
         // case 'F10':
         //    if (event.shiftKey) { onContextPress(event, documentId); }
         //    break;
      }
   }
</script>

{#each [...$content] as macro (macro.id)}
   <li class="directory-item document flexrow">
      {#if macro.img}
         <img class=thumbnail title={macro.name} alt={macro.name} src={macro.img} />
      {/if}
      <div class=bmd-menu-focus-indicator />
      <!-- svelte-ignore a11y-missing-attribute -->
      <a on:click|preventDefault={() => onPress(macro.id)}
         on:keydown={onKeydown}
         on:keyup={(event) => onKeyup(event, macro.id)}
         on:contextmenu|preventDefault={(event) => onContextMenu(event, macro.id)}
         role=button
         tabindex=0>
         <h4>{macro.name}</h4>
      </a>
   </li>
{/each}

<style>
   a:focus-visible {
      outline: none;
      text-shadow: var(--tjs-default-text-shadow-focus-hover, 0 0 8px red);
   }

   /* Enable focus indicator for focus-within */
   /* Note: the use of `has` pseudo-selector that requires a child with :focus-visible */
   li:focus-within:has(:focus-visible) .bmd-menu-focus-indicator {
      background: var(--bmd-menu-focus-indicator-color, var(--tjs-default-color-focus, white));
   }

   /* Fallback for browsers that don't support 'has'; any user interaction including mouse will trigger */
   @supports not (selector(:has(*))) {
      li:focus-within .bmd-menu-focus-indicator {
         background: var(--bmd-menu-focus-indicator-color, var(--tjs-default-color-focus, white));
      }
   }

   .bmd-menu-focus-indicator {
      flex: 0 0 4px;
   }

   .directory-item {
      gap: 3px;
   }

   h4 {
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
   }
</style>