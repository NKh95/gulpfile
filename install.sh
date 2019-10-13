#!/bin/bash
#	GULPFILE BY N.Kh.
#	Link: https://github.com/NKh95/gulpfile_by_nkh.git
#	License: MIT License
#	Version: 1.0.8

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
	npm i -D gulp-babel @babel/core @babel/preset-env
}

header (){
	reset
	echo -e "\n GULPFILE BY N.Kh. \n\n Link: https://github.com/NKh95/gulpfile_by_nkh.git \n License: MIT License \n Version: 1.0.8 \n"
	echo -e " $i / $iterations \n"
}

gulpLauncher (){
	read -r -p " run gulp now? [y/N] " response_0
	if [[ $response_0 =~ ^([yY])$ ]]; then
		echo " gulp launch..."
		gulp
	fi
}

page_1 (){
	echo -e " Select stylesheet syntax: \n    1) CSS (default) \n    2) SCSS \n    3) SASS \n"
	
	S_TYPE="const stylesheetSyntax="
	SASS="sass"
	SCSS="scss"
	CSS="css"

	read response_1
	if  [[ $response_1 == 1 ]]; then
		sed -i -e "s/$S_TYPE.*/$S_TYPE '$CSS';/" gulpfile.js
		dir_type=$CSS

	elif  [[ $response_1 == 2 ]]; then
		sed -i -e "s/$S_TYPE.*/$S_TYPE '$SCSS';/" gulpfile.js
		dir_type=$SCSS

	elif  [[ $response_1 == 3 ]]; then
		sed -i -e "s/$S_TYPE.*/$S_TYPE '$SASS';/" gulpfile.js
		dir_type=$SASS

	else
		sed -i -e "s/$S_TYPE.*/$S_TYPE '$CSS';/" gulpfile.js
		dir_type=$CSS

	fi
}

page_2 (){
	read -r -p " Use Babel when building? [y/N]: " response_1_1
	
	BABEL="const gulpBabel="

	if [[ $response_1_1 =~ ^([yY])$ ]]; then
		sed -i -e "s/$BABEL.*/$BABEL true;/" gulpfile.js
	else
		sed -i -e "s/$BABEL.*/$BABEL false;/" gulpfile.js
	fi
}

page_3 (){
	mkdir -p src/{js,css,$dir_type,fonts,img}
	mkdir -p dist

	read -r -p " Сreate empty source files(.html, .js, .$dir_type)? [y/N]: " response_2
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
}

page_4 (){
	read -r -p " Install/reinstall gulp plugins(npm packages)? [y/N]: " response_3
	if [[ $response_3 =~ ^([yY])$ ]]; then
		rm -rf node_modules

		gulpPlugins

		touch .gitignore
		read -r first_line < .gitignore

		if [[ $first_line != "node_modules" ]]; then
			echo "node_modules" >> .gitignore
		fi

		header
			echo -e " Gulp plugins installed/reinstalled \n"
			npm list --depth=0
			gulpLauncher
	else
		header
			gulpLauncher 
	fi
}

main (){
	iterations=4
	for (( i=0; i <= $iterations; i++))
		do
			header
				case $i in
					1)
						page_1
					;;

					2)
						page_2
					;;

					3)
						page_3
					;;

					4)
						page_4
					;;
				esac
		done
}

main