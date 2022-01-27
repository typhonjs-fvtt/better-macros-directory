<script>
   import { getContext }         from 'svelte';

   import {
      ApplicationShell,
      TJSApplicationShell }      from '@typhonjs-fvtt/runtime/svelte/component/core';

   import MacroDirectory         from './dir/MacroDirectory.svelte';

   import { sessionConstants }   from "#constants";

   export let elementRoot;

   const context = getContext('external');

   const eventbus = context.eventbus;
   const elementRootUpdate = context.elementRootUpdate();

   const storeDarkMode = eventbus.triggerSync('bmd:storage:session:store:get', sessionConstants.themeDarkMode, true);

   let appShell;

   $: appShell = $storeDarkMode ? TJSApplicationShell : ApplicationShell;

   $: if(elementRootUpdate(elementRoot)) {
      console.log(`!!!! BMD - initializing new root`);
   }
</script>

<svelte:options accessors={true}/>

<svelte:component this={appShell} bind:elementRoot>
   <MacroDirectory/>
</svelte:component>