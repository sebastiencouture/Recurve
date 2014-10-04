/*global module:false*/
module.exports = function(grunt) {
    var banner =
        '/*!\n<%= pkg.name %>.js - v<%= pkg.version %>\n' +
            'Created by <%= pkg.author %> on <%=grunt.template.today("yyyy-mm-dd") %>.\n\n' +
            '<%= pkg.repository.url %>\n\n' +
            '<%= license %> \n' +
            '*/';
    var minBanner = '/*! <%= pkg.name %>.js - v<%= pkg.version %> - by <%= pkg.author %> ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */';

    require('load-grunt-tasks')(grunt);
    var files = require('./files.js').files;

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        license: grunt.file.read("LICENSE"),
        buildDir: "build",
        distDir: "dist",

        clean: [ "<%= distDir %>" ],

        concat: {
            options: {
                stripBanners: true,
                banner: banner + "\n\n(function(window){\n",
                footer: "\nvar recurve = window.recurve = {};\ncreateApi(recurve);\n})(window);"
            },

            build: {
                src: files.recurveSrc,
                dest: "<%= buildDir %>/recurve.js"
            },

            release: {
                src: "<%= buildDir %>/recurve.js",
                dest: "dist/<%= pkg.name %>.js"
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', '<%= buildDir %>/<%= pkg.name %>.js'],
            options: {
                eqnull: true
            }
        },

        uglify: {
            options: {
                banner: minBanner
            },

            recurve: {
                files: {
                    "<%= distDir %>/<%= pkg.name %>.min.js": ["<%= buildDir %>/<%= pkg.name %>.js"]
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
            files: ["src/**/*.js", "test/**/*.js"],
            tasks: ["concat:build", "karma:unit:run"]
        },

        connect: {
            server: {
                port: 8000
            }
        }
    });

    grunt.registerTask("default", ["build", "jshint", "karma"]);
    grunt.registerTask("build", "Perform a normal build", ["concat", "uglify"]);
    grunt.registerTask("dist", "Perform a clean build", ["clean", "build"]);
    grunt.registerTask("dev", "Run dev server and watch for changes", ["concat:build", "connect", "karma", "watch"]);
    grunt.registerTask("test", "Run tests once", ["karma:unit:run"]);
};