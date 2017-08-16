<!-- @@@page:roadmap@@@ -->
<!-- @@@title:Roadmap@@@ -->

Roadmap
=======

As GiantJS aims to cover all aspects of modern web applications, it's constantly growing, adding new modules. This page summarizes the current state of available and planned modules.

### Stable modules

These modules are not expected to break existing API.

They also cover the basics for building apps, with the exception of backend API access. (For that, you may still use the deprecated `giant-transport` module. Its replacement, `giant-rest`, is going to have a similar API.)


| Module name | Tier | Description | Stability
|:------------|:-----|:------------|----------:
| giant-assertion | essentials | Extensible assertions | STABLE
| giant-data | essentials | Basic data structures | STABLE
| giant-event | essentials | Universal events | STABLE
| giant-oop | essentials | OOP & testing tools | STABLE
| giant-table | essentials | Indexed tables | STABLE
| giant-templating | essentials | String templating | STABLE
| giant-utils | essentials | General utility classes | STABLE
| giant-entity | core | Entity framework | STABLE
| giant-i18n | core | Internationalization | STABLE
| giant-routing | core | Routing | STABLE
| giant-widget | core | Widget framework | STABLE
| giant-basic-widgets | auxiliary | Basic widgets | FAIRLY STABLE

### Modules in progress

| Module name | Tier | Description | Stability
|:------------|:-----|:------------|---------:
| giant-project-boilerplate | N/A | Project boilerplate | UNSTABLE
| giant-module-boilerplate | N/A | Module boilerplate | UNSTABLE
| giant-cli | auxiliary | Application building tools | UNSTABLE
| giant-asset | auxiliary | Asset management | UNSTABLE
| giant-cli-tools | auxiliary | CLI building tools | UNSTABLE
| giant-grunt-tools | auxiliary | [Grunt](http://gruntjs.com/) integration | UNSTABLE

### Planned modules

| Module name | Tier | Description | Stability
|:------------|:-----|:------------|---------:
| giant-behaviors | essentials | Common class behaviors | N/A
| giant-rest | core | REST API access | N/A
| giant-session | core | User session management | N/A
| giant-automation | auxiliary | Batch scripting tools | N/A
| giant-diagnostic-widgets | auxiliary | Runtime diagnostic tools | N/A
| giant-ga-tools | auxiliary | Google Analytics integration | N/A
| giant-logging | auxiliary | Logging | N/A
| giant-material-widgets | auxiliary | Widgets based on [Google Material Design](https://www.google.com/design/spec/material-design) | N/A
| giant-offline | auxiliary | Offline entity persistence | N/A

### Deprecated modules

| Module name | Tier | Description | Stability
|:------------|:-----|:------------|---------:
| giant-common-widgets | obsolete | Commonly used widgets | DEPRECATED
| giant-transport | obsolete | Transport layer | DEPRECATED
