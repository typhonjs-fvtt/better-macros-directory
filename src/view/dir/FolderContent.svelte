<script>
   import { getContext }               from 'svelte';
   import { TJSContextMenu }           from '#standard/application';

   import { createMacroContextItems }  from './createMacroContextItems.js';

   import { constants }                from '#constants';

   export let content;

   const { application, eventbus } = getContext('#external');

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
      TJSContextMenu.create({
         id: 'better-macros-directory-context-menu',
         items: createMacroContextItems(eventbus, documentId),
         focusEl: constants.appId,
         event,
         activeWindow: application.reactive.activeWindow
      });
   }

   function onContextPress(event, documentId)
   {
      TJSContextMenu.create({
         id: 'better-macros-directory-context-menu',
         items: createMacroContextItems(eventbus, documentId),
         focusEl: constants.appId,
         event,
         activeWindow: application.reactive.activeWindow
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
            onContextPress(event, documentId);
            break;
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
         on:contextmenu|preventDefault={(event) => onContextMenu(event, macro.id)}
         on:keydown={onKeydown}
         on:keyup={(event) => onKeyup(event, macro.id)}
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
      background: var(--bmd-menu-focus-indicator-background, var(--tjs-default-focus-indicator-background, white));
   }

   /* Fallback for browsers that don't support 'has'; any user interaction including mouse will trigger */
   @supports not (selector(:has(*))) {
      li:focus-within .bmd-menu-focus-indicator {
         background: var(--bmd-menu-focus-indicator-background, var(--tjs-default-focus-indicator-background, white));
      }
   }

   .bmd-menu-focus-indicator {
      align-self: var(--bmd-menu-focus-indicator-align-self, var(--tjs-default-focus-indicator-align-self, stretch));
      border: var(--bmd-menu-focus-indicator-border, var(--tjs-default-focus-indicator-border));
      border-radius: var(--bmd-menu-focus-indicator-border-radius, var(--tjs-default-focus-indicator-border-radius, 0.1em));
      flex: 0 0 var(--bmd-menu-focus-indicator-width, var(--tjs-default-focus-indicator-width, 0.25em));
      height: var(--bmd-menu-focus-indicator-height, var(--tjs-default-focus-indicator-height));
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