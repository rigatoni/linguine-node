// Karma configuration
// Generated on Sun Nov 16 2014 10:48:59 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'public/bower_components/ng-file-upload/angular-file-upload-html5-shim.min.js',
      'public/bower_components/angular/angular.min.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/bower_components/d3/d3.min.js',
      'public/bower_components/d3-cloud/build/d3.layout.cloud.js',
      'public/bower_components/lodash/dist/lodash.min.js',
      'public/bower_components/ng-file-upload/angular-file-upload.min.js',
      'public/bower_components/ui-router/release/angular-ui-router.min.js',
      'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'public/bower_components/angular-spinner/angular-spinner.min.js',
      'assets/js/linguine.module.js',
      'assets/js/corpora/corpora.module.js',
      'assets/js/analysis/analysis.module.js',
      'assets/js/**/*.js',
      'test/angular/**/*.test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'assets/js/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    coverageReporter: {
      reporters:[
        {type: 'text'},
        {type: 'text-summary'}
      ]
    }
  });
};
