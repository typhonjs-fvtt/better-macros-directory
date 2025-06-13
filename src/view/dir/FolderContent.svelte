<script>
   import { getContext }               from 'svelte';
   import { TJSContextMenu }           from '#standard/application/menu';

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

   function onContextMenu(event, documentId)
   {
      TJSContextMenu.create({
         id: 'better-macros-directory-context-menu',
         items: createMacroContextItems(eventbus, documentId),
         focusEl: constants.appId,
         event
      });
   }

   function onContextPress(event, documentId)
   {
      TJSContextMenu.create({
         id: 'better-macros-directory-context-menu',
         items: createMacroContextItems(eventbus, documentId),
         focusEl: constants.appId,
         event
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
   <li class="directory-item entry document flexrow"
       on:click|preventDefault={() => onPress(macro.id)}
       on:contextmenu|preventDefault={(event) => onContextMenu(event, macro.id)}
       on:keydown={onKeydown}
       on:keyup={(event) => onKeyup(event, macro.id)}
       role=menuitem
       tabindex=0>
      {#if macro.img}
         <img class=thumbnail alt={macro.name} src={macro.img} />
      {/if}

      <div class=bmd-menu-focus-indicator />

      <span>{macro.name}</span>
   </li>
{/each}

<style>
   .directory-item {
      gap: 3px;
      padding: 0.25rem;
   }

   .directory-item:focus-visible {
      outline: none;
      text-shadow: var(--tjs-default-text-shadow-focus-hover, 0 0 8px red);
   }

   li:hover {
      cursor: var(--tjs-cursor-pointer, pointer);
   }

   /* Enable focus indicator */
   li:focus-visible .bmd-menu-focus-indicator {
      background: var(--bmd-menu-focus-indicator-background, var(--tjs-default-focus-indicator-background, white));
   }

   .bmd-menu-focus-indicator {
      align-self: var(--bmd-menu-focus-indicator-align-self, var(--tjs-default-focus-indicator-align-self, stretch));
      border: var(--bmd-menu-focus-indicator-border, var(--tjs-default-focus-indicator-border));
      border-radius: var(--bmd-menu-focus-indicator-border-radius, var(--tjs-default-focus-indicator-border-radius, 0.1em));
      flex: 0 0 var(--bmd-menu-focus-indicator-width, var(--tjs-default-focus-indicator-width, 0.25em));
      height: var(--bmd-menu-focus-indicator-height, var(--tjs-default-focus-indicator-height));
   }
</style>
