<script>
   export let content;

   function onClickMacro(documentId)
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
</script>

{#each [...$content] as macro (macro.id)}
   <li class="directory-item document flexrow">
      {#if macro.data.img}
         <img class=thumbnail title={macro.name} alt={macro.name} src={macro.data.img}/>
      {/if}
      <h4 class="document-name">
         <a on:click|preventDefault={() => onClickMacro(macro.id)}>{macro.name}</a>
      </h4>
   </li>
{/each}