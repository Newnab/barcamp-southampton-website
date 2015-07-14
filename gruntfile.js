module.exports = function(grunt) {

    // All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		
		//Asset clean up
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'img/'
				}]
			}
		},
		uglify: {
			options:{
				sourceMap: true
			},
			minify_js: {
				files: {
					//'scripts/main.min.js': ['scripts/main.js'],
					//'scripts/plugins.min.js': ['scripts/plugins.js'],
					'scripts/output.min.js': ['scripts/plugins.js', '/scripts/event-tracking.js', 'scripts/main.js']
				}
			}
		},
		
		// Image spriting
		sprite:{
		  all: {
			src: 'img/raw/*.png',
			retinaSrcFilter: 'img/raw/*-2x.png',
			dest: 'img/sprite.png',
			retinaDest: 'img/sprite-2x.png',
			destCss: 'css/_spritesmith.scss'
		  }
		},
		
		//CSS Generation
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'css/style.css': 'css/style.scss',
					'css/old-ie.css': 'css/old-ie.scss',
					'css/editor.css': 'css/editor.scss'
				}
			}
		},
		autoprefixer: {
            options: {
			  // Task-specific options go here.
			},

			// prefix the specified file
			single_file: {
			  options: {
				// Target-specific options go here.
			  },
			  src: 'css/style.css',
			  dest: 'css/style.css'
			},
        },
		csso: {
			compress: {
				options: {
				  report: 'gzip'
				},
				files: {
				  'css/style.css': ['css/style.css']
				}
			},
			restructure: {
				options: {
				  report: 'min'
				},
				files: {
				  'css/style.css': ['css/style.css']
				}
			}
		},
		
		// Linting
		csslint: {
			check: {
				src: [
					'css/*.css'
				]
			}
		},	
		jshint: {
			all: ['gruntfile.js', 'scripts/*.js']
		},

		
		// Regeneration/Change Detection
		watch: {
			options: {
				livereload: false,
			},
			scripts: {
				files: ['scripts/*.js'],
				tasks: ['uglify'/*,'jshint'*/],
				options: {
					spawn: false,
				},
			},
			css: {
				files: ['css/*.scss'],
				tasks: ['sprite', 'sass', 'autoprefixer', 'csso'/*, 'csslint'*/],
				options: {
					spawn: false,
				}
			}
		},
		
		//Run build and serve at the same time.
		serve: {
			options: {
				port: 9000
			}
		}
	


    });

    //// Plugin List
	// Asset clean up
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// Image Spriting
	grunt.loadNpmTasks('grunt-spritesmith');
	
	//CSS generation
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-csso');
	
	//Linting
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
    //Regeneration/Change Detection
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	//Running
	grunt.loadNpmTasks('grunt-serve');
	

    //// Tasks
	grunt.registerTask('default', ['imagemin', 'uglify', 'sprite', 'sass', 'autoprefixer', 'csso'/*, 'csslint', 'jshint'*/, 'watch']);
	grunt.registerTask('server', ['serve']);
};