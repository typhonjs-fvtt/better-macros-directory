<script>
   import { getContext }               from 'svelte';
   import { TJSContextMenu }           from '@typhonjs-fvtt/svelte-standard/application';

   import { createMacroContextItems }  from './createMacroContextItems.js';

   export let content;

   const eventbus = getContext('external').eventbus;

   function onClick(documentId)
   {
      const sheet = game.macros.get(documentId).sheet;

      // If the sheet is already rendered:
      if (sheet.rendered)
      {
         sheet.bringToTop();
         return sheet.maximize();
      }

      // Otherwise render the sheet
      else sheet.render(true);
   }

   function onContextClick(event, documentId)
   {
      TJSContextMenu.create({ x: event.pageX, y: event.pageY, items: createMacroContextItems(eventbus, documentId)});
   }
</script>

{#each [...$content] as macro (macro.id)}
   <li class="directory-item document flexrow">
      {#if macro.img}
         <img class=thumbnail title={macro.name} alt={macro.name} src={macro.img}/>
      {/if}
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-missing-attribute -->
      <a on:click|preventDefault={() => onClick(macro.id)}
         on:contextmenu|preventDefault={(event) => onContextClick(event, macro.id)}>
         <h4 class="document-name">{macro.name}</h4>
      </a>
   </li>
{/each}