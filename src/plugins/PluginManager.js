import {
   EventbusSecure,
   PluginManager }   from '@typhonjs-fvtt/runtime/plugin/manager';

const pluginManager = new PluginManager();

const mainEventbus = pluginManager.getEventbus();

// Create a secure eventbus which can not have new registrations to the plugin eventbus.
export const eventbus = EventbusSecure.initialize(mainEventbus, 'plugin-eventbus').eventbusSecure;

export default pluginManager;