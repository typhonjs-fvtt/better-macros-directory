<script>
   import { getContext }         from 'svelte';

   import {
      ApplicationShell,
      TJSApplicationShell }      from '#runtime/svelte/component/application';

   import { Timing }             from '#runtime/util';

   import MacroDirectory         from './dir/MacroDirectory.svelte';

   import { sessionConstants }   from "#constants";

   export let elementRoot;

   const external = getContext('#external');

   const application = external.application;
   const eventbus = external.eventbus;
   const elementRootUpdate = external.elementRootUpdate();

   // ----------------------------------------------------------------------------------------------------------------

   // Handle updating the application shell depending on dark mode state.

   const storeThemeTransparent = eventbus.triggerSync('bmd:storage:session:store:get',
    sessionConstants.themeTransparent, false);

   let appShell;

   $: appShell = $storeThemeTransparent ? TJSApplicationShell : ApplicationShell;

   // Explicitly lock theme to `dark` when transparent.
   $: application.reactive.themeName = $storeThemeTransparent ? 'dark' : void 0;

   $: if(elementRootUpdate(elementRoot)) {
      console.log(`!!! BMDAppShell updated`);
   }

   // ----------------------------------------------------------------------------------------------------------------

   // Get a store that is synchronized with session storage.
   const stateStore = eventbus.triggerSync('bmd:storage:session:store:get', sessionConstants.appState);

   // Application position store reference. Stores need to be a top level variable to be accessible for reactivity.
   const position = application.position;

   // A debounced callback that serializes application state after 500-millisecond delay.
   const storePosition = Timing.debounce(() => $stateStore = application.state.current(), 500);

   // Reactive statement to invoke debounce callback on Position changes.
   $: storePosition($position);
</script>

<svelte:options accessors={true} />

<svelte:component this={appShell} bind:elementRoot>
   <MacroDirectory />
</svelte:component>
