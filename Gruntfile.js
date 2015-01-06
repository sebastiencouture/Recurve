/*global module:false,
 require: false
*/
module.exports = function(grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);
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
        distDir: "dist",

        clean: [ "<%= distDir %>" ],

        concat: {
            buildCore: {
                options: {
                    stripBanners: true,
                    banner: "(function(window){\n\n'use strict';\n\n",
                    footer: "\n\nvar recurve = window.recurve = {};\ncreateApi(recurve, '<%= pkg.version %>');\n\n})(window);",
                    process: concatProcessor
                },
                src: files.recurveSrc,
                dest: "<%= buildDir %>/recurve.js"
            },

            buildModules: {
                options: {
                    stripBanners: true,
                    banner: "(function(window){\n\n'use strict';\n\n",
                    footer: "\n\n})(window);",
                    process: concatProcessor
                },
                files: {
                    "<%= buildDir %>/<%= pkg.name %>-mock.js": files.recurveModules.mock,
                    "<%= buildDir %>/<%= pkg.name %>-flux.js": files.recurveModules.flux,
                    "<%= buildDir %>/<%= pkg.name %>-flux-rest.js": files.recurveModules.fluxRest,
                    "<%= buildDir %>/<%= pkg.name %>-flux-state.js": files.recurveModules.fluxState
                }
            },

            release: {
                options: {
                    banner: banner + "\n\n"
                },
                files: {
                    "dist/<%= pkg.name %>.js": "<%= buildDir %>/recurve.js",
                    "<%= distDir %>/<%= pkg.name %>-mock.js": "<%= buildDir %>/<%= pkg.name %>-mock.js",
                    "<%= distDir %>/<%= pkg.name %>-flux.js": "<%= buildDir %>/<%= pkg.name %>-flux.js",
                    "<%= distDir %>/<%= pkg.name %>-flux-rest.js": "<%= buildDir %>/<%= pkg.name %>-flux-rest.js",
                    "<%= distDir %>/<%= pkg.name %>-flux-state.js": "<%= buildDir %>/<%= pkg.name %>-flux-state.js"
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true,
            },
            recurve: files.recurveSrc,
            recurveMock: files.recurveModules.mock,
            recurveFlux: files.recurveModules.flux,
            recurveFluxRest: files.recurveModules.fluxRest,
            recurveFluxState: files.recurveModules.fluxState,
            test: files.test
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
                    "<%= distDir %>/<%= pkg.name %>-flux-state.min.js": "<%= buildDir %>/<%= pkg.name %>-flux-state.js"
                }
            },
        },

        karma: {
            unit: {
                configFile: "karma.conf.js",
                background: true,
                singleRun: false
            }
        },

        watch: {
            files: ["src/**/*.js", "test/**/*.js"],
            tasks: ["concat:buildCore", "karma:unit:run"]
        },

        connect: {
            server: {
                port: 8000
            }
        },

        docs: {
            recurve: {
                src: "src",
                dest: "build/docs",
                docs: "docs"
            }
        }
    });

    grunt.registerTask("default", ["build", "jshint", "karma"]);
    grunt.registerTask("build", "Perform a normal build", ["concat", "uglify"]);
    grunt.registerTask("dist", "Perform a clean build", ["clean", "build"]);
    grunt.registerTask("dev", "Run dev server and watch for changes", ["concat:buildCore", "connect", "karma", "watch"]);
    grunt.registerTask("test", "Run tests once", ["karma:unit:run"]);
};