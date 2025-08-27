<script>
   import { getContext }               from 'svelte';

   import { inlineSvg }                from '#runtime/svelte/action/dom/inline-svg';
   import { AssetValidator }           from '#runtime/util/browser';

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

   /**
    * Foundry has many SVG icons hardcoded with `white` as the color. The transform below for the `inlineSvg` action
    * replaces any variation of `fill="#000"` and `fill="#fff"` with `fill="currentColor"` which allows icons to appear
    * equally on dark / light theme variations.
    *
    * @param {string}   svg - loaded SVG content.
    */
   function transformSvg(svg)
   {
      return svg.replace(
         /\bfill\s*=\s*(["'])?#(?:000(?:000)?|fff(?:fff)?)(?:\1|(?![0-9a-fA-F]))/gi,
         'fill="currentColor"'
      );
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
         {@const result = AssetValidator.parseMedia({
            url: macro.img,
            mediaTypes: AssetValidator.MediaTypes.img_svg
         })}

         {#if result.valid && result.elementType === 'img'}
            <img class=thumbnail alt={macro.name} src={macro.img} />
         {:else if result.valid && result.elementType === 'svg'}
            <svg use:inlineSvg={{ src: macro.img, transform: transformSvg }}></svg>
         {/if}
      {/if}

      <TJSFocusIndicator />

      <span>{macro.name}</span>
   </li>
{/each}

<style lang=scss>
   svg {
      // Some Foundry SVG icons have no `fill` defined, so always use `currentColor`.
      // The `transformSvg` function converts explicit `fill="#fff"` to `fill="currentColor"` as well.
      fill: currentColor;

      flex: 0 0 var(--sidebar-item-height);
      height: var(--sidebar-item-height);
      width: var(--sidebar-item-height);
      border: none;
   }

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
