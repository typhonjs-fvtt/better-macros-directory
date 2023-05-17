import { PluginManager }   from '#runtime/plugin/manager';

const pluginManager = new PluginManager();

// Create a secure eventbus which can not have new registrations to the plugin eventbus.
export const eventbus = pluginManager.createEventbusSecure('plugin-eventbus');

export default pluginManager;