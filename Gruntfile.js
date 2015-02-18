/*global module:false,
 require: false
*/
module.exports = function(grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);
    var modRewrite = require('connect-modrewrite');

    grunt.loadTasks("docs/tasks");

    var banner =
        '/*!\n<%= pkg.name %>.js - v<%= pkg.version %>\n' +
            'Created by <%= pkg.author %> on <%=grunt.template.today("yyyy-mm-dd") %>.\n\n' +
            '<%= pkg.repository.url %>\n\n' +
            '<%= license %> \n' +
            '*/';
    var minBanner = '/*! <%= pkg.name %>.js - v<%= pkg.version %> - by <%= pkg.author %> ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */';

    var files = require('./files.js').files;

    function concatProcessor(src, filepath) {
        return '\n// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        license: grunt.file.read("LICENSE"),
        buildDir: "build",
        buildDocsDir: "build/docs",
        buildDocsDataDir: "<%= buildDocsDir %>/data",
        buildJsxDir: "build/jsx",
        distDir: "dist",
        distDocsDir: "dist/docs",
        distDocsDataDir: "<%= distDocsDir %>/data",

        clean: [ "<%= buildDir %>", "<%= distDir %>" ],

        concat: {
            buildCore: {
                options: {
                    stripBanners: true,
                    banner: grunt.file.read("src/recurve.banner").toString(),
                    footer: grunt.file.read("src/recurve.footer").toString(),
                    process: concatProcessor
                },
                src: files.recurveSrc,
                dest: "<%= buildDir %>/recurve.js"
            },

            buildModules: {
                options: {
                    stripBanners: true,
                    banner: grunt.file.read("src/module.banner").toString(),
                    footer: grunt.file.read("src/module.footer").toString(),
                    process: concatProcessor
                },
                files: {
                    "<%= buildDir %>/<%= pkg.name %>-mock.js": files.recurveModules.mock,
                    "<%= buildDir %>/<%= pkg.name %>-flux.js": files.recurveModules.flux,
                    "<%= buildDir %>/<%= pkg.name %>-flux-rest.js": files.recurveModules.fluxRest,
                    "<%= buildDir %>/<%= pkg.name %>-flux-react.js": files.recurveModules.fluxReact
                }
            },

            buildDocsJs: {
                options: {
                    stripBanners: true,
                    banner: grunt.file.read("docs/app/src/docs.banner").toString(),
                    footer: grunt.file.read("docs/app/src/docs.footer").toString(),
                    process: concatProcessor
                },
                files: {
                    "<%= buildDocsDir %>/js/<%= pkg.name %>-docs.js": files.docs.js.concat("<%= buildJsxDir %>/docs/**/*.js")
                }
            },

            buildDocsCss: {
                options: {
                    process: concatProcessor
                },
                files: {
                    "<%= buildDocsDir %>/scss/<%= pkg.name %>-docs.scss": files.docs.scss
                }
            },

            buildDocsHtml: {
                files: {
                    "<%= buildDocsDir %>/index.html" : "docs/app/index-dev.html"
                }
            },

            dist: {
                options: {
                    banner: banner + "\n\n"
                },
                files: {
                    "dist/<%= pkg.name %>.js": "<%= buildDir %>/recurve.js",
                    "<%= distDir %>/<%= pkg.name %>-mock.js": "<%= buildDir %>/<%= pkg.name %>-mock.js",
                    "<%= distDir %>/<%= pkg.name %>-flux.js": "<%= buildDir %>/<%= pkg.name %>-flux.js",
                    "<%= distDir %>/<%= pkg.name %>-flux-rest.js": "<%= buildDir %>/<%= pkg.name %>-flux-rest.js",
                    "<%= distDir %>/<%= pkg.name %>-flux-state.js": "<%= buildDir %>/<%= pkg.name %>-flux-state.js",
                    "<%= distDir %>/<%= pkg.name %>-flux-react.js": "<%= buildDir %>/<%= pkg.name %>-flux-react.js"
                }
            },

            distDocsHtml: {
                options: {
                    banner: banner + "\n\n"
                },
                files: {
                    "<%= distDocsDir %>/index.html" : "docs/app/index-prod.html"
                }
            }
        },

        react: {
            docs: {
                files: [
                    {
                        expand: true,
                        cwd: "docs",
                        src: ["**/*.jsx"],
                        dest: "<%= buildJsxDir %>/docs",
                        ext: ".js"
                    }
                ]
            }
        },

        uglify: {
            options: {
                banner: minBanner
            },

            recurve: {
                files: {
                    "<%= distDir %>/<%= pkg.name %>.min.js": "<%= buildDir %>/<%= pkg.name %>.js",
                    "<%= distDir %>/<%= pkg.name %>-mock.min.js": "<%= buildDir %>/<%= pkg.name %>-mock.js",
                    "<%= distDir %>/<%= pkg.name %>-flux.min.js": "<%= buildDir %>/<%= pkg.name %>-flux.js",
                    "<%= distDir %>/<%= pkg.name %>-flux-rest.min.js": "<%= buildDir %>/<%= pkg.name %>-flux-rest.js",
                    "<%= distDir %>/<%= pkg.name %>-flux-state.min.js": "<%= buildDir %>/<%= pkg.name %>-flux-state.js",
                    "<%= distDir %>/<%= pkg.name %>-flux-react.min.js": "<%= buildDir %>/<%= pkg.name %>-flux-react.js"
                }
            },

            docs: {
                files: {
                    "<%= distDocsDir %>/js/<%= pkg.name %>-docs.min.js": "<%= buildDocsDir %>/js/<%= pkg.name %>-docs.js"
                }
            }
        },

        sass: {
            options: {
                lineNumbers: true,
                style: "expanded"
            },

            docs: {
                files : {
                    "<%= buildDocsDir %>/css/<%= pkg.name %>-docs.css": "<%= buildDocsDir %>/scss/<%= pkg.name %>-docs.scss"
                }
            }
        },

        cssmin: {
            docs: {
                files: {
                    "<%= distDocsDir %>/css/<%= pkg.name %>-docs.min.css": "<%= buildDocsDir %>/css/<%= pkg.name %>-docs.css"
                }
            }
        },

        copy: {
            docsBuild: {
                files: [
                    {
                        expand: true,
                        cwd: "docs/app/assets/img/",
                        src: "**",
                        dest: "<%= buildDocsDir %>/img"
                    },
                    {
                        expand: true,
                        cwd: "docs/app/assets/vendor/",
                        src: "**",
                        dest: "<%= buildDocsDir %>/vendor"
                    },
                    {
                        expand: true,
                        cwd: "<%= buildDir %>",
                        src: "<%= pkg.name %>.js",
                        dest: "<%= buildDocsDir %>/vendor"
                    },
                    {
                        expand: true,
                        cwd: "<%= buildDir %>",
                        src: "<%= pkg.name %>-flux.js",
                        dest: "<%= buildDocsDir %>/vendor"
                    },
                    {
                        expand: true,
                        cwd: "<%= buildDir %>",
                        src: "<%= pkg.name %>-flux-react.js",
                        dest: "<%= buildDocsDir %>/vendor"
                    }
                ]
            },

            docsDist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= buildDocsDir %>/data",
                        src: "**",
                        dest: "<%= distDocsDir %>/data"
                    },
                    {
                        expand: true,
                        cwd: "<%= buildDir %>/img",
                        src: "**",
                        dest: "<%= distDocsDir %>/img"
                    },
                    {
                        expand: true,
                        cwd: "docs/app/assets/vendor/",
                        src: "**",
                        dest: "<%= distDocsDir %>/vendor"
                    },
                    {
                        expand: true,
                        cwd: "<%= distDir %>",
                        src: "<%= pkg.name %>.min.js",
                        dest: "<%= distDocsDir %>/vendor"
                    },
                    {
                        expand: true,
                        cwd: "<%= distDir %>",
                        src: "<%= pkg.name %>-flux.min.js",
                        dest: "<%= distDocsDir %>/vendor"
                    },
                    {
                        expand: true,
                        cwd: "<%= distDir %>",
                        src: "<%= pkg.name %>-flux-react.min.js",
                        dest: "<%= distDocsDir %>/vendor"
                    }
                ]
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },

            recurve: files.recurveSrc,
            recurveMock: files.recurveModules.mock,
            recurveFlux: files.recurveModules.flux,
            recurveFluxRest: files.recurveModules.fluxRest,
            recurveFluxReact: files.recurveModules.fluxReact,
            docs: files.docs.js.concat(files.docs.tasks),
            test: files.test
        },

        karma: {
            options: {
                configFile: "karma.conf.js"
            },

            continous: {
                singleRun: true,
                browsers: ['PhantomJS']
            },

            unit: {
                background: true,
                singleRun: false
            }
        },

        watch: {
            recurve: {
                files: ["src/**/*.js", "test/**/*.js"],
                tasks: ["concat:buildCore", "karma:unit:run"]
            },

            docs: {
                files: ["src/**/*.js", "docs/app/src/**/*.js", "docs/app/src/**/*.jsx", "docs/app/assets/**/*.scss", "docs/app/*.html", "docs/tasks/**/*.js"],
                tasks: ["react", "concat:buildCore", "concat:buildModules", "concat:buildDocsJs", "concat:buildDocsCss", "concat:buildDocsHtml", "sass", "docsGen", "copy"]
            }
        },

        connect: {
            recurve: {
                options: {
                    port: 8000
                }

            },

            docs: {
                options: {
                    port: 9000,
                    base: "build/docs",

                    middleware: function (connect, options) {
                        var middlewares = [];
                        var directory = options.directory || options.base[options.base.length - 1];

                        // enable HTML5 mode
                        middlewares.push(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png$ /index.html [L]']));

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        options.base.forEach(function(base) {
                            // Serve static files.
                            middlewares.push(connect.static(base));
                        });

                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                }
            }
        },

        docsGen: {
            docs: {
                output: "<%= buildDocsDataDir %>",
                docs: "docs",

                version: {
                    input: "package.json",
                    output: "<%= buildDocsDataDir %>/version.json"
                },

                api: {
                    input: "src",
                    output: "<%= buildDocsDataDir %>/api",
                    metadataOutput: "<%= buildDocsDataDir %>/api.json",
                    examples: "docs/content/api/examples",
                    baseUrl: "/data/api",
                    baseAppPath: "/api"
                },

                rdoc: {
                    input: "docs/content",
                    output: "<%= buildDocsDataDir %>/content",
                    metadataOutput: "<%= buildDocsDataDir %>/content.json",
                    baseUrl: "/data/content"
                }
            }
        }
    });


    grunt.registerTask("dev", "Run dev server and watch for changes for recurve", ["concat:buildCore", "connect:recurve", "karma:unit", "watch:recurve"]);
    grunt.registerTask("devDocs", "Run dev server and watch for changes for docs", ["react", "concat:buildCore", "concat:buildModules", "concat:buildDocsJs", "concat:buildDocsCss", "concat:buildDocsHtml", "sass", "docsGen", "copy", "connect:docs", "watch:docs"]);
    grunt.registerTask("dist", "Create a distribution build of recurve and docs", ["clean", "react", "concat", "uglify", "sass", "cssmin", "docsGen", "copy", "karma:continous", "jshint"]);
    grunt.registerTask("test", "Run unit tests and jshint", ["karma:continous", "jshint"]);
};