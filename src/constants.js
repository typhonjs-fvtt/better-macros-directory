/**
 * Defines the main constants for module name and label.
 *
 * @type {{moduleId: string, moduleLabel: string}}
 */
const constants = {
   moduleId: 'better-macros-directory',
   moduleLabel: `Better Macros Directory`
};

/**
 * @type {BMDSettings} Defines all the module settings for world and client.
 */
const settings = {
   something: 'something'
};

/**
 * @type {BMDSessionConstants} Defines all the module session storage static constants.
 */
const sessionConstants = {
   appState: `${constants.moduleId}.settings.appState`,
   menuScale: `${constants.moduleId}.menu.scale`,
   themeDarkMode: `${constants.moduleId}.theme.dark`,
   scrolltopPartial: `${constants.moduleId}.scrolltop-`
};

export { constants, sessionConstants, settings };

/**
 * @typedef {object} BMDSettings
 *
 * @property {string} something - Setting key for 'something'
 */

/**
 * @typedef {object} BMDSessionConstants
 *
 * @property {string} appState - Stores the application state / position.
 *
 * @property {string} menuScale - Scaling factor for menu item size / height.
 *
 * @property {string} themeDarkMode - Indicates whether dark mode is enabled.
 *
 * @property {string} scrolltopPartial - Provides the scrolltop store partial to construct.
 */