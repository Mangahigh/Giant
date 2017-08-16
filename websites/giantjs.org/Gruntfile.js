/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var $asset = require('giant-asset'),
        $gruntTools = require('giant-grunt-tools'),
        multiTasks = [].toMultiTaskCollection(),
        gruntTasks = [].toGruntTaskCollection();

    $gruntTools.GruntProxy.create()
        .setGruntObject(grunt);

    'clean'
        .toMultiTask({
            'default': 'public/'
        })
        .setPackageName('grunt-contrib-clean')
        .addToCollection(multiTasks);

    'markdown'
        .toMultiTask(function () {
            var tocHtml = {};

            return {
                toc: {
                    files: [
                        {
                            expand: true,
                            cwd   : 'developer-guide/src/toc',
                            src   : '*.md',
                            dest  : 'public',
                            ext   : '.html'
                        }
                    ],

                    options: {
                        template         : 'src/templates/fragment.html',
                        preCompile       : function (src) {
                            // replacing extensions
                            return src.replace(/\.md/g, '.html');
                        },
                        postCompile      : function (src, context) {
                            tocHtml[context.page] = src;
                        },
                        contextBinder    : true,
                        contextBinderMark: '@@@'
                    }
                },

                'default': {
                    files: [
                        {
                            expand: true,
                            cwd   : 'src',
                            src   : '*.md',
                            dest  : 'public',
                            ext   : '.html'
                        }, {
                            expand: true,
                            cwd   : 'developer-guide/src',
                            src   : '*.md',
                            dest  : 'public',
                            ext   : '.html'
                        }
                    ],

                    options: {
                        template         : 'src/templates/main.html',
                        preCompile       : function (src, context) {
                            // setting current year in footer
                            context.currentYear = new Date().getFullYear();

                            // replacing extensions
                            return src.replace(/\.md/g, '.html');
                        },
                        postCompile      : function (src, context) {
                            return [tocHtml[context.page], src].join('\n');
                        },
                        contextBinder    : true,
                        contextBinderMark: '@@@',
                        markdownOptions  : {
                            gfm      : true,
                            highlight: 'manual',
                            tables   : true
                        }
                    }
                }
            };
        })
        .setPackageName('grunt-markdown')
        .addToCollection(multiTasks);

    'copy'
        .toMultiTask({
            'default': {
                files: [
                    // framework dependencies
                    {
                        expand: true,
                        cwd   : 'node_modules',
                        src   : [
                            '**/giant-*.js',
                            '**/giant-*.css',
                            '**/dist/jquery.js'
                        ],
                        dest  : 'public/lib/',
                        flatten: true
                    }, {
                        expand: true,
                        cwd   : 'src',
                        src   : '**/*.css',
                        dest  : 'public'
                    }, {
                        expand: true,
                        cwd   : '.',
                        src   : 'images/*',
                        dest  : 'public'
                    }, {
                        cwd : '.',
                        src : 'node_modules/highlight.js/styles/vs.css',
                        dest: 'public/css/highlight.css'
                    }
                ]
            }
        })
        .setPackageName('grunt-contrib-copy')
        .addToCollection(multiTasks);

    'string-replace'
        .toMultiTask({
            'ga': {
                options: {
                    replacements: [{
                        pattern    : '<!--GA-->',
                        replacement: grunt.file.read('./src/templates/ga.html')
                    }]
                },
                files  : [{
                    src : 'public/*.html',
                    dest: 'public/'
                }]
            }
        })
        .setPackageName('grunt-string-replace')
        .addToCollection(multiTasks);

    'ftp-deploy'
        .toMultiTask({
            'default': {
                auth: {
                    host   : 'ftp.giantjs.org',
                    port   : 21,
                    authKey: 'giantjso'
                },
                src : 'public',
                dest: 'www'
            }
        })
        .setPackageName('grunt-ftp-deploy')
        .addToCollection(multiTasks);

    'build-dev'
        .toAliasTask()
        .addSubTasks(
        'clean',
        'markdown:toc', 'markdown:default', 'copy:default')
        .addToCollection(gruntTasks);

    'build-prod'
        .toAliasTask()
        .addSubTasks('clean', 'markdown:toc', 'markdown:default', 'copy:default', 'string-replace:ga')
        .addToCollection(gruntTasks);

    'deploy'
        .toAliasTask()
        .addSubTasks('build-prod', 'ftp-deploy:default')
        .addToCollection(gruntTasks);

    // registering tasks
    multiTasks.toGruntConfig()
        .applyConfig()
        .getAliasTasksGroupedByTarget()
        .mergeWith(multiTasks.toGruntTaskCollection())
        .mergeWith(gruntTasks)
        .applyTask();
};
