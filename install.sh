#!/bin/bash
gulpPlugins (){
	npm i -D gulp
	npm i -D gulp-sass
	npm i -D gulp-concat
	npm i -D gulp-clean-css
	npm i -D gulp-uglify-es
	npm i -D gulp-htmlmin
	npm i -D gulp-debug
	npm i -D browser-sync
	npm i -D gulp-autoprefixer
	npm i -D gulp-sourcemaps
	npm i -D node-normalize-scss
	npm i -D gulp-filesize
	npm i -D browserslist
	npm i -D del	
}

header (){
	reset
	echo -e "\n GULPFILE BY N.Kh. \n\n Link: https://github.com/NKh95/gulpfile_by_nkh.git \n version: 1.0.4 \n"
	i=$(($i+1))
	echo -e " $i / 4 \n"
}

gulpLaunch (){
	read -r -p " run gulp now? [y/N] " response_0
	if [[ $response_0 =~ ^([yY])$ ]]; then
		echo " gulp launch..."
		gulp
	fi
}

#page 1
header
	echo -e " Select preprocessor type: \n    1) CSS (default) \n    2) SCSS \n    3) SASS"

	S_TYPE="const styleType="
	SASS="'sass';"
	SCSS="'scss';"
	CSS="'css';"

	read  response_1

	if  [[ $response_1 == 1 ]]; then
		sed -i -e "s/$S_TYPE.*/$S_TYPE$CSS/" gulpfile.js
		dir_type="css"

	elif  [[ $response_1 == 2 ]]; then
		sed -i -e "s/$S_TYPE.*/$S_TYPE$SCSS/" gulpfile.js
		dir_type="scss"

	elif  [[ $response_1 == 3 ]]; then
		sed -i -e "s/$S_TYPE.*/$S_TYPE$SASS/" gulpfile.js
		dir_type="sass"

	else
		sed -i -e "s/$S_TYPE.*/$S_TYPE$CSS/" gulpfile.js
		dir_type="css"
	fi

#page 2
header
	mkdir -p src/{js,css,$dir_type,fonts,img}
	mkdir -p dist

	read -r -p " Сreate empty source files(file.html/js/sass/scss/css)? [y/N] " response_2
	if [[ $response_2 =~ ^([yY])$ ]]; then
	    cd src
			touch index.html

			cd js
				touch script.js
			cd ..

			cd css
				touch common.css
			cd ..

			if  [[ $dir_type != "css" ]]; then
				cd  $dir_type
					touch common.$dir_type
				cd ..
			fi
		cd ..
	fi

npm init -y

#page 3
header
	read -r -p " Install/reinstall gulp plugins(npm packages)? [y/N] " response_3
	if [[ $response_3 =~ ^([yY])$ ]]; then
		echo " "
		rm -rf node_modules
		gulpPlugins
		
		touch .gitignore
		read -r first_line < .gitignore

		if [[ $first_line != "node_modules" ]]; then
			echo "node_modules" >> .gitignore
		fi

		#page 4
		header
			echo " Gulp plugins installed/reinstalled"
			echo " "
			npm list --depth=0
			echo " "
			gulpLaunch
	else
		#page 5
		header
			gulpLaunch
	fi
