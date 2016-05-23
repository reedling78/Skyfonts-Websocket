/*jslint nomen: true */
/*globals window, document, define, $, _, console, Modernizr, alert*/


var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');


gulp.task('startserver', function () {
    'use strict';

    nodemon({
        script: 'server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    });

});

gulp.task('startsite', function () {
    'use strict';

    nodemon({
        script: 'site.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    });
    
});