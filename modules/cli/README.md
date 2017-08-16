Command line interface for Giant
================================

Collection of command line tools for managing Giant-based projects (including Giant itself).

Stability: **UNSTABLE** (In development)

Installation
------------

    npm install -g giant-cli

Usage
-----

### Initializing a project

Pulls project boilerplate and initializes 2 basic modules: `application` & `shared`.

1. Create the project folder
2. `cd` into the project folder
3. Issue `giant init`

### Initializing a module

Pulls module boilerplate.

1. Make sure you're in the project folder
2. Issue `giant init <moduleName>`

### Building a module

Builds the specified module.

    giant build <moduleName>
    
### Building all modules

Builds all modules in the order specified in `module-sequence.dat`.

    giant build

### Clearing all modules

Removes temporary files.

    giant clear
    
### Running command for a specific module

    giant run <moduleName> "<command>"
    
### Running a command for all modules

    giant batch "<command>"
