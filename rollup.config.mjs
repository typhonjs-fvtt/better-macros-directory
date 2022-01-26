import alias               from '@rollup/plugin-alias';
import { babel }           from '@rollup/plugin-babel';
import commonjs            from '@rollup/plugin-commonjs';
import postcss             from 'rollup-plugin-postcss';       // Process Sass / CSS w/ PostCSS
import resolve             from '@rollup/plugin-node-resolve'; // This resolves NPM modules from node_modules.
import sourcemaps          from 'rollup-plugin-sourcemaps';
import svelte              from 'rollup-plugin-svelte';
import preprocess          from 'svelte-preprocess';
import { terser }          from 'rollup-plugin-terser';        // Terser is used for minification / mangling
import {
   postcssConfig,
   terserConfig,
   typhonjsRuntime }       from '@typhonjs-fvtt/runtime/rollup';

const s_COMPRESS = false;
const s_SOURCEMAPS = true;
const s_TYPHONJS_MODULE_LIB = false;

const postcssMain = postcssConfig({
   extract: 'better-macro-directory.css',
   compress: s_COMPRESS,
   sourceMap: s_SOURCEMAPS
});

const s_RESOLVE_CONFIG = {
   browser: true,
   dedupe: ['svelte', '@typhonjs-fvtt/runtime', '@typhonjs-fvtt/svelte-standard']
}

export default () =>
{
   // Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
   // minified / mangled.
   const outputPlugins = s_COMPRESS ? [terser(terserConfig())] : [];

   // Defines whether source maps are generated / loaded from the .env file.
   const sourcemap = s_SOURCEMAPS;

   return [
      {  // The main module bundle
         input: `src/init.js`,
         output: {
            file: `dist/better-macro-directory.js`,
            format: 'es',
            plugins: outputPlugins,
            sourcemap,
         },
         plugins: [
            alias({
               entries: [
                  { find: '#constants', replacement: './src/constants.js' },
                  { find: '#views', replacement: './src/view/index.js' }
               ]
            }),
            svelte({
               preprocess: preprocess(),
               onwarn: (warning, handler) =>
               {
                  // Suppress `a11y-missing-attribute` for missing href in <a> links.
                  if (warning.message.includes(`<a> element should have an href attribute`)) { return; }

                  // Let Rollup handle all other warnings normally.
                  handler(warning);
               },
            }),
            postcss(postcssMain),
            resolve(s_RESOLVE_CONFIG),
            commonjs(),
            sourcemaps(),
            s_TYPHONJS_MODULE_LIB && typhonjsRuntime(),
            babel({
               babelHelpers: 'bundled',
               presets: [
                  ['@babel/preset-env', { bugfixes: true, shippedProposals: true, targets: { esmodules: true } }]
               ]
            })
         ]
      }
   ];
};
