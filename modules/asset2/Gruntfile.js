/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var $asset = require('giant-asset'),
        $gruntTools = require('giant-grunt-tools'),
        packageNode = require('./package.json'),
        manifestNode = require('./manifest.json'),
        manifest = $asset.Manifest.create(manifestNode),
        multiTasks = [].toMultiTaskCollection(),
        gruntTasks = [].toGruntTaskCollection(),

    // when truthy, leaves out non-vital and potentially slow tasks
        quick = grunt.option('quick');

    $gruntTools.GruntProxy.create()
        .setGruntObject(grunt);

    'clean'
        .toMultiTask({
            default: ['lib']
        })
        .setPackageName('grunt-contrib-clean')
        .addToCollection(multiTasks);

    'concat'
        .toMultiTask({
            'default': {
                files: [
                    {
                        src : manifest.getAssets('js').getAssetNames(),
                        dest: 'lib/' + packageNode.name + '.js'
                    }
                ]
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
        .addSubTasks('clean', 'concat')
        .addToCollection(gruntTasks);

    if (!quick) {
        'build'.toAliasTask()
            .addSubTaskAfter('karma', 'clean');
    }

    // registering tasks
    multiTasks.toGruntConfig()
        .applyConfig()
        .getAliasTasksGroupedByTarget()
        .mergeWith(multiTasks.toGruntTaskCollection())
        .mergeWith(gruntTasks)
        .applyTask();
};
