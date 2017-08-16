/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var $asset = require('giant-asset'),
        $gruntTools = require('giant-grunt-tools'),
        packageNode = require('./package.json'),
        manifestNode = require('./manifest.json'),
        manifest = $asset.Manifest.create(manifestNode),
        multiTasks = [].toMultiTaskCollection(),
        gruntTasks = [].toGruntTaskCollection();

    $gruntTools.GruntProxy.create()
        .setGruntObject(grunt);

    'concat'
        .toMultiTask({
            'default': {
                files: [{
                    src : manifest.getAssets('js')
                        .getAssetNames(),
                    dest: 'lib/' + packageNode.name + '.js'
                }, {
                    src : manifest.getAssets('css')
                        .getAssetNames(),
                    dest: 'lib/' + packageNode.name + '.css'
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
