/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var $asset = require('giant-asset'),
        $gruntTools = require('giant-grunt-tools'),
        packageNode = require('./package.json'),
        manifest = $asset.Manifest.create(require('./manifest.json')),
        mainModule = manifest.getModule('main'),
        demoModule = manifest.getModule('demo'),
        multiTasks = [].toMultiTaskCollection(),
        gruntTasks = [].toGruntTaskCollection();

    $gruntTools.GruntProxy.create()
        .setGruntObject(grunt);

    'concat'
        .toMultiTask({
            'default': {
                files: [{
                    src : mainModule.getAssets('js')
                        .getAssetNames(),
                    dest: 'lib/' + packageNode.name + '.js'
                }, {
                    src : mainModule.getAssets('css')
                        .getAssetNames(),
                    dest: 'lib/' + packageNode.name + '.css'
                }]
            },

            'demo': {
                files: [{
                    src : demoModule.getAssets('html')
                        .getAssetNames(),
                    dest: 'lib/doc/' + packageNode.name + '-demo.html'
                }, {
                    src : demoModule.getAssets('js')
                        .getAssetNames(),
                    dest: 'lib/doc/' + packageNode.name + '-demo.js'
                }, {
                    src : demoModule.getAssets('css')
                        .getAssetNames(),
                    dest: 'lib/doc/' + packageNode.name + '-demo.css'
                }]
            }
        })
        .setPackageName('grunt-contrib-concat')
        .addToCollection(multiTasks);

    'karma'
        .toMultiTask({
            'default': {
                configFile: 'karma.conf.js',
                singleRun : true
            }
        })
        .setPackageName('grunt-karma')
        .addToCollection(multiTasks);

    'build'
        .toAliasTask()
        .addSubTasks('karma', 'concat')
        .addToCollection(gruntTasks);

    // registering tasks
    multiTasks.toGruntConfig()
        .applyConfig()
        .getAliasTasksGroupedByTarget()
        .mergeWith(multiTasks.toGruntTaskCollection())
        .mergeWith(gruntTasks)
        .applyTask();
};
