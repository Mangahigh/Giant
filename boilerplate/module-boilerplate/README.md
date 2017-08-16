Giant Project Module
====================

This is a brand-new module in your Giant project.

Stability: **UNSTABLE** (In development)

To set things up:

1. Set the correct module name & description in `package.json`, add & remove dependencies and package attributes as needed.
    - Add intra-project dependencies as optional.
    - Add current module as optional dependency to dependents, eg. the `application` module.
2. Add / remove Grunt tasks as needed in `Gruntfile.js`.
3. Change module namespace (`$module` by default) in `src/namespace.js` and `src/exports.js`.
4. Add custom dependencies to `karma.conf.js`.
5. Rename sample class from `ModuleClass`.
6. Remove TODOs.
7. As you go along, add source files to `manifest.json`.

Couple of notes:

- Make sure definition files have the `.def.js` extension.
- Make sure test files have the `.test.js` extension.
- Group files that belong together in the same folder. Eg: `Dog.def.js`, `Dog.test.js`, `Dog.css`.
