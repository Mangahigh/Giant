(function () {
    "use strict";

    module("Manifest");

    var MyManifest = $asset2.Manifest.extend();

    test("File name decomposition", function () {
        deepEqual('foo.js'.match($asset2.Manifest.RE_FILE_COMPONENTS), ['foo.js', undefined, 'foo', '.js']);
        deepEqual('bar/foo.js'.match($asset2.Manifest.RE_FILE_COMPONENTS), ['bar/foo.js', 'bar/', 'foo', '.js']);
        deepEqual('bar/foo.baz.js'.match($asset2.Manifest.RE_FILE_COMPONENTS), ['bar/foo.baz.js', 'bar/', 'foo.baz', '.js']);
    });

    test("Instantiation", function () {
        var manifestNode = {},
            manifest;

        throws(function () {
            $asset2.Manifest.create('foo');
        }, "should raise exception on invalid argument");

        manifest = $asset2.Manifest.create(manifestNode);

        ok(manifest.manifestTree.isA($data.Tree), "should set manifestTree property");
        strictEqual(manifest.manifestTree.items, manifestNode, "should set manifestNode as tree buffer");
        equal(manifest.basePath, '', "should set basePath property");
    });

    test("Base path setter", function () {
        var manifest = $asset2.Manifest.create({});

        strictEqual(manifest.setBasePath('foo/bar/'), manifest, "should be chainable");
        equal(manifest.basePath, 'foo/bar/', "should set basePath property");
    });

    test("File names getter", function () {
        var manifest = $asset2.Manifest.create({
            'default'  : {
                assets: {
                    js: [
                        'foo.js',
                        'bar/baz.js'
                    ]
                }
            },
            development: {
                assets: {
                    css: [
                        'bar.css'
                    ]
                }
            }
        });

        throws(function () {
            manifest.getFileNames();
        }, "should raise exception on missing arguments");

        throws(function () {
            manifest.getFileNames(1, false);
        }, "should raise exception on invalid arguments");

        deepEqual(manifest.getFileNames('foo', 'js'), [],
            "should return undefined for invalid targetName / assetType combination");

        deepEqual(manifest.getFileNames('default', 'js'), [
            'foo.js',
            'bar/baz.js'
        ], "should return asset array");
    });

    test("File names as hash geter", function () {
        var manifest = $asset2.Manifest.create({
                'default'  : {
                    assets: {
                        js: [
                            'foo.js',
                            'bar/baz.js'
                        ]
                    }
                },
                development: {
                    assets: {
                        css: [
                            'bar.css'
                        ]
                    }
                }
            }),
            hash = manifest.getFileNamesAsHash('development', 'css');

        ok(hash.isA($data.Hash), "should return Hash instance");
        deepEqual(hash.items, ['bar.css'], "should return file names wrapped in a hash");
    });

    test("Assets getter as Hash", function () {
        var manifest = $asset2.Manifest.create({
                'default': {
                    assets: {
                        js: [
                            'foo.js',
                            'foo.css',
                            'foo.json'
                        ]
                    }
                }
            }),
            hash = manifest.getAssetsAsHash('default', 'js');

        ok(hash.isA($data.Hash), "should return Hash instance");
        deepEqual(hash.items, [
            $asset2.JsAsset.create('foo.js'),
            $asset2.CssAsset.create('foo.css'),
            $asset2.ManifestAsset.create('foo.json')
        ], "should return asset instances wrapped in a hash");
    });

    test("Obtaining reduced manifest", function () {
        var manifest = MyManifest.create({
                core       : {
                    assets: {
                        css: [
                            'core.css'
                        ]
                    }
                },
                'default'  : {
                    assets: {
                        js : [
                            'foo.js',
                            'baz.js',
                            'foo/foo.json'
                        ],
                        css: [
                            'foo.css'
                        ]
                    }
                },
                development: {
                    assets: {
                        css: [
                            'bar.css',
                            'foo/foo.json'
                        ]
                    }
                }
            }),
            reducedManifest = manifest.getReducedManifest();

        ok(reducedManifest.isA(MyManifest), "should return Manifest instance");
        deepEqual(reducedManifest.manifestTree.items, {
            core       : {
                assets: {
                    css: [
                        'core.css'
                    ]
                }
            },
            'default'  : {
                assets: {
                    js : [
                        'default.js'
                    ],
                    css: [
                        'default.css'
                    ]
                }
            },
            development: {
                assets: {
                    css: [
                        'development.css'
                    ]
                }
            }
        }, "should return transformed manifest");
        deepEqual(manifest.manifestTree.items, {
            core       : {
                assets: {
                    css: [
                        'core.css'
                    ]
                }
            },
            'default'  : {
                assets: {
                    js : [
                        'foo.js',
                        'baz.js',
                        'foo/foo.json'
                    ],
                    css: [
                        'foo.css'
                    ]
                }
            },
            development: {
                assets: {
                    css: [
                        'bar.css',
                        'foo/foo.json'
                    ]
                }
            }
        }, "should leave original manifest intact");
    });

    test("Obtaining resolved manifest", function () {
        var manifest = MyManifest.create({
            core       : {
                assets: {
                    css: [
                        'core.css'
                    ]
                }
            },
            'default'  : {
                assets: {
                    js : [
                        'foo.js',
                        'baz.js',
                        'foo/foo.json'
                    ],
                    css: [
                        'foo.css'
                    ]
                }
            },
            development: {
                assets: {
                    css: [
                        'bar.css',
                        'foo/foo.json'
                    ]
                }
            }
        });

        $asset2.ManifestAsset.addMocks({
            _readFileSyncProxy: function (jsonPath) {
                return JSON.stringify({
                    'foo/foo.json': {
                        'default': {
                            assets: {
                                js: ['bar.js', 'quux.js']
                            }
                        }
                    }
                }[jsonPath]);
            }
        });

        var resolvedManifest = manifest.getResolvedManifest();

        $asset2.ManifestAsset.removeMocks();

        ok(resolvedManifest.isA(MyManifest), "should return Manifest instance");
        deepEqual(resolvedManifest.manifestTree.items, {
            "core"       : {
                "assets": {
                    "css": [
                        "core.css"
                    ]
                }
            },
            "default"    : {
                "assets": {
                    "js" : [
                        "foo.js",
                        "baz.js",
                        "foo/bar.js",
                        "foo/quux.js"
                    ],
                    "css": [
                        "foo.css"
                    ]
                }
            },
            "development": {
                "assets": {
                    "css": [
                        "bar.css"
                    ]
                }
            }
        }, "should set manifest contents");
        deepEqual(manifest.manifestTree.items, {
            core       : {
                assets: {
                    css: [
                        'core.css'
                    ]
                }
            },
            'default'  : {
                assets: {
                    js : [
                        'foo.js',
                        'baz.js',
                        'foo/foo.json'
                    ],
                    css: [
                        'foo.css'
                    ]
                }
            },
            development: {
                assets: {
                    css: [
                        'bar.css',
                        'foo/foo.json'
                    ]
                }
            }
        }, "should leave original manifest intact");
    });

    test("Nested resolution", function () {
        var manifest = MyManifest.create({
            'default': {
                assets: {
                    js: [
                        'helloworld.js',
                        'outer/foo.json'
                    ]
                }
            }
        });

        $asset2.ManifestAsset.addMocks({
            _readFileSyncProxy: function (jsonPath) {
                return JSON.stringify({
                    'outer/foo.json': {
                        'default': {
                            assets: {
                                js: [
                                    'bar.js',
                                    'quux.js',
                                    'inner/baz.json'
                                ]
                            }
                        }
                    },
                    'inner/baz.json': {
                        'default': {
                            assets: {
                                js: [
                                    'foo.js',
                                    'baz.js'
                                ]
                            }
                        }
                    }
                }[jsonPath]);
            }
        });

        var resolvedManifest = manifest.getResolvedManifest();

        $asset2.ManifestAsset.removeMocks();

        deepEqual(resolvedManifest.manifestTree.items, {
            "default": {
                "assets": {
                    "js": [
                        "helloworld.js",
                        "outer/bar.js",
                        "outer/quux.js",
                        "outer/inner/foo.js",
                        "outer/inner/baz.js"
                    ]
                }
            }
        }, "should resolve nested references");
    });

    test("Obtaining flattened manifest", function () {
        var manifest = MyManifest.create({
            core       : {
                assets: {
                    css: [
                        'this/foo.css'
                    ]
                }
            },
            'default'  : {
                assets: {
                    js : [
                        'that/foo.js',
                        undefined,
                        'hello/world/baz.js'
                    ],
                    css: [
                        'whatever/foo.css'
                    ]
                }
            },
            development: {
                assets: {
                    js : [
                        'this/baz.js'
                    ],
                    css: [
                        'that/bar.css'
                    ]
                }
            }
        });

        var flattenedManifest = manifest.getFlatManifest();

        ok(flattenedManifest.isA(MyManifest), "should return Manifest instance");
        deepEqual(flattenedManifest.manifestTree.items, {
            core       : {
                assets: {
                    css: [
                        'foo2.css'
                    ]
                }
            },
            'default'  : {
                assets: {
                    js : [
                        'foo1.js',
                        undefined,
                        'baz2.js'
                    ],
                    css: [
                        'foo1.css'
                    ]
                }
            },
            development: {
                assets: {
                    js : [
                        'baz1.js'
                    ],
                    css: [
                        'bar1.css'
                    ]
                }
            }
        }, "should change file names");
    });
}());
