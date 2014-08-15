"use strict";

var banner =
    '/*!\n<%= pkg.name %>.js - v<%= pkg.version %>\n' +
    'Created by <%= pkg.author %> on <%=grunt.template.today("yyyy-mm-dd") %>.\n\n' +
    '<%= pkg.repository.url %>\n\n' +
    '<%= license %> \n' +
    '*/';
var minBanner = '/*! <%= pkg.name %>.js - v<%= pkg.version %> - by <%= pkg.author %> ' +
    '<%= grunt.template.today("yyyy-mm-dd") %> */';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        license: grunt.file.read("LICENSE"),

        browserify: {
            dist: {
                src: ["src/*.js"],
                dest: "dist/recurve.js"
            },

            distSourceMap: {
                src: ["src/*.js"],
                dest: "dist/recurve-sourcemap.js",
                options: {
                    bundleOptions: {
                        debug: true
                    }
                }
            },

            karma: {
                src: ["tests/*.test.js"],
                dest: "dist/tests.js",
                options: {
                    bundleOptions: {
                        debug: true
                    }
                }
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: banner
            },

            dist: {
                src: ['dist/recurve.js'],
                dest: 'dist/recurve.js'
            },

            distSourceMap: {
                src: ['dist/recurve-sourcemap.js'],
                dest: 'dist/recurve-sourcemap.js'
            },

            karma: {
                src: ['dist/tests.js'],
                dest: 'dist/tests.js'
            }
        },

        uglify: {
            options: {
                banner: minBanner
            },

            dist: {
                files: {
                    "dist/recurve.min.js": ["dist/recurve.js"]
                }
            }
        },

        karma: {
            unit: {
                configFile: "karma.conf.js",
                background: true,
                singleRun: false
            }
        },

        watch: {
            browserify: {
                files: ["src/**/*.*", "tests/**/*.*"],
                tasks: ["browserify"]
            },

            browserifyKarma: {
                files: ["src/**/*.*", "tests/**/*.*"],
                tasks: ["browserify:karma"]
            },

            karma: {
                files: ["dist/tests.js", "karma.conf.js"],
                tasks: ["karma:unit:run"]
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },

            dev: {
                tasks: ["watch:browserifyKarma", "watch:karma"]
            }
        },

        connect: {
            server: {
                port: 8000
            }
        }
    });

    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask("default", ["browserify", "concat", "uglify", "connect", "karma", "watch"]);
    grunt.registerTask("dev", ["browserify:karma", "connect", "karma", "concurrent:dev"]);
    grunt.registerTask("test", ["karma:unit:run"]);
};