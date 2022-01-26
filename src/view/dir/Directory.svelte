<script>
   import { getContext }         from 'svelte';
   import { writable }           from 'svelte/store';

   import {
      ripple,
      rippleFocus,
      storeScrolltop }           from '@typhonjs-fvtt/svelte-standard/action';

   import {
      TJSInput,
      TJSMenu,
      TJSSelect,
      TJSToggleIconButton }      from '@typhonjs-fvtt/svelte-standard/component';

   import { sessionConstants }   from "#constants";

   const eventbus = getContext('external').eventbus;

   const storeScroll = writable(void 0);
</script>

<section class=top-bar>
</section>

<div class=container use:storeScrolltop={storeScroll}>
</div>

<style>
   .top-bar {
      display: flex;
      padding: 4px;
      flex: 1 1 20px;
      justify-content: center;
   }

   .container {
      overflow-y: auto;
   }
</style>