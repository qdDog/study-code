var gulp 			 = require('gulp'),
	notify			 = require('gulp-notify'),
	plumber			 = require('gulp-plumber'),
	rename			 = require('gulp-rename'),
	concat			 = require('gulp-concat'),
	cache 	 		 = require('gulp-cache'),
	
	cssmin			 = require('gulp-clean-css'),
	cssverion		 = require('gulp-make-css-url-version'),
	sass			 = require('gulp-sass'),
	autoprefixer	 = require('gulp-autoprefixer'),

	browserSync 	 = require('browser-sync').create(),
	reload 			 = browserSync.reload,
	imagemin 		 = require('gulp-imagemin'),
	imageminPngquant = require('imagemin-pngquant'),

	htmlmin			 = require('gulp-htmlmin'),
	uglify			 = require('gulp-uglify'),
	babel			 = require('gulp-babel');


//静态服务器
gulp.task('serve', function() {
    var files = [
    '**/*.html',
    '**/*.css',
    '**/*.js'
    ];

    browserSync.init(files,{
        server: {
            baseDir: "./"
        }
    });
});

//代理设置
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "你的域名或IP"
    });
});

//编译sass
gulp.task('sass', function() {
	return gulp.src('src/sass/*.scss')
		   .pipe(sass({ outputStyle: 'expanded' }))
		   .pipe(autoprefixer({
				browsers: ['last 2 versions', 'safari 5', 'ios 6', 'Android >= 4.0'],
				cascade: true, 	 	 //是否美化属性值 默认：true 像这样：
	            remove: true		 //是否去掉不必要的前缀 默认：true
			}))
	       .pipe(gulp.dest('src/css'))
	       .pipe(reload({stream: true}));
});


/**
 * 	打包压缩代码
 */
//html压缩
gulp.task('htmlmin', function() {
	var options = {
        removeComments: true,					//清除HTML注释
        collapseWhitespace: true,				//压缩HTML
        collapseBooleanAttributes: true,		//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,			//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,		//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,	//删除<style>和<link>的type="text/css"
        minifyJS: true,							//压缩页面JS
        minifyCSS: true							//压缩页面CSS
    };
	gulp.src('src/view/**/*.html')
		.pipe(htmlmin(options))
		.pipe(gulp.dest('dist/html'));
});

//css压缩
gulp.task('compressCss', function() {
	gulp.src('src/css/*.css')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(concat('index.css'))
        .pipe(rename({suffix: '.min'}))
		.pipe(cssverion())	 		//给css文件里引用文件加版本号（文件MD5）
		.pipe(cssmin({
            advanced: false,		//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            keepBreaks: false,		//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
		.pipe(gulp.dest('dist/css'));
});

//js压缩
gulp.task('uglify', function() {
	gulp.src('src/js/**/*.js')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(concat('index.js'))
        .pipe(rename({suffix: '.min'}))
		.pipe(uglify({
            mangle: true,				//类型：Boolean 默认：true 是否修改变量名
            compress: true,				//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' 	//保留所有注释
        }))
		.pipe(gulp.dest('dist/js'));
});

//图片压缩
gulp.task('compressImage', function() {
	gulp.src('src/images/*.{png,jpg,gif}')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(cache(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({plugins: [{removeViewBox: true}]})
		])))
		.pipe(gulp.dest('dist/images'));
});

//监听文件变动，实时编译
gulp.task('watchFile', function() {
	gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/view/**/*.html').on('change', reload);
    gulp.watch('src/js/**/*.js').on('change', reload);
});

//打包压缩代码
gulp.task('compressFile', ['compressCss', 'compressImage', /*'uglify', 'htmlmin'*/]);


gulp.task('default', ['serve', 'watchFile']); //定义默认任务
