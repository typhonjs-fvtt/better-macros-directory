<script>
   import { getContext }               from 'svelte';
   import { TJSContextMenu }           from '#standard/application/menu';
   import { TJSFocusIndicator }        from '#standard/component/dom/focus';

   import { createMacroContextItems }  from './createMacroContextItems.js';

   import { constants }                from '#constants';

   export let content;

   const { eventbus } = getContext('#external');

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

   /**
    * Stores the current macro ID when context menu is displayed to add a class to the invoking macro content.
    *
    * @type {string}
    */
   let contextId = void 0;

   function onContextMenu(event, documentId)
   {
      // Store macro ID for context CSS class.
      contextId = documentId;

      TJSContextMenu.create({
         id: 'better-macros-directory-context-menu',
         items: createMacroContextItems(eventbus, documentId),
         focusEl: constants.appId,
         event,
         onClose: () => contextId = void 0 // Reset contextId on close.
      });

      event.preventDefault();
      event.stopPropagation();
   }

   function onKeydown(event)
   {
      switch (event.code)
      {
         case 'Enter':
         case 'ContextMenu':
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

         case 'ContextMenu':
            onContextMenu(event, documentId);
            break;
      }
   }
</script>

{#each [...$content] as macro (macro.id)}
   <li class="directory-item entry document flexrow"
       class:context-menu={contextId === macro.id}
       on:click|preventDefault={() => onPress(macro.id)}
       on:contextmenu|preventDefault={(event) => onContextMenu(event, macro.id)}
       on:keydown={onKeydown}
       on:keyup={(event) => onKeyup(event, macro.id)}
       role=menuitem
       tabindex=0>
      {#if macro.img}
         <img class=thumbnail alt={macro.name} src={macro.img} />
      {/if}

      <TJSFocusIndicator />

      <span>{macro.name}</span>
   </li>
{/each}

<style>
   .context-menu {
      --context-menu-color: var(--color-warm-2);
   }

   .directory-item {
      border: 1px solid var(--context-menu-color, transparent);
      gap: 3px;
      padding: 0.25rem;
   }

   .directory-item:focus-visible {
      outline: none;
   }

   li:hover {
      cursor: var(--tjs-cursor-pointer, pointer);
   }

   /* Enable focus indicator */
   li:focus-visible {
      --tjs-focus-indicator-background: currentColor;
      background: var(--sidebar-entry-hover-bg, rgba(255, 255, 255, 0.1))
   }
</style>
