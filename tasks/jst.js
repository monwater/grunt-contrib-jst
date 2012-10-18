/*
 * grunt-contrib-jst
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tim Branyen, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = require('underscore');

  // filename conversion for templates
  var defaultProcessName = function(name) { return name; };

  grunt.registerMultiTask('jst', 'Compile underscore templates to JST file', function() {

    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = this.options({
      namespace: 'JST',
      templateSettings: {}
    });

    // assign filename transformation functions
    var processName = options.processName || defaultProcessName;

    grunt.verbose.writeflags(options, 'Options');

    var compiled, srcFiles, src, filename;
    var output = [];
    var nsInfo = helpers.getNamespaceDeclaration(options.namespace);

    this.files.forEach(function(files) {
      srcFiles = grunt.file.expandFiles(files.src);
      srcFiles.forEach(function(file) {
        src = grunt.file.read(file);

        try {
          compiled = _.template(src, false, options.templateSettings).source;
        } catch (e) {
          grunt.log.error(e);
          grunt.fail.warn('JST failed to compile.');
        }

        filename = processName(file);
        output.push(nsInfo.namespace+'['+JSON.stringify(filename)+'] = '+compiled+';');
      });

      if(output.length > 0) {
        output.unshift(nsInfo.declaration);
        grunt.file.write(files.dest, output.join('\n\n'));
        grunt.log.writeln('File "' + files.dest + '" created.');
      }
    });

  });
};
