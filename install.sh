#!/bin/bash

echo " "
echo " GULPFILE BY N.Kh."
echo " "
echo " Link: https://github.com/NKh95/gulpfile_by_nkh.git"
echo " version: 1.0.3"
echo " "

echo " Select preprocessor type:"
echo "   1) CSS (default)"
echo "   2) SCSS"
echo "   3) SASS"
echo " "

S_TYPE="const styleType="

SASS="'sass';"
SCSS="'scss';"
CSS="'css';"

read  response_1

if  [[ $response_1 == 1 ]]; then
	sed -i -e "s/$S_TYPE.*/$S_TYPE$CSS/" gulpfile.js
	dir_type="css"
	echo " You choosed css."

elif  [[ $response_1 == 2 ]]; then

	sed -i -e "s/$S_TYPE.*/$S_TYPE$SCSS/" gulpfile.js
	dir_type="scss"
	echo " You choosed scss."

elif  [[ $response_1 == 3 ]]; then

	sed -i -e "s/$S_TYPE.*/$S_TYPE$SASS/" gulpfile.js
	dir_type="sass"
	echo " You choosed sass."

else

	sed -i -e "s/$S_TYPE.*/$S_TYPE$CSS/" gulpfile.js
	dir_type="css"
	echo " default (css)."
fi

mkdir -p src/{js,css,$dir_type,fonts,img}
mkdir -p dist
echo " "

read -r -p " Сreate empty source files(index.html, script.js, common.sass/scss/css)? [y/N] " response_2
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
	
	echo " Source files created"

else
    echo " Source fille not created"
fi

touch .gitignore
read -r first_line < .gitignore

if [[ $first_line != "node_modules" ]]; then
	echo "node_modules" >> .gitignore
fi

echo " "
echo " Install/reinstall npm packages."
echo " "

npm init -y

gulp_plugins_list_file=`cat plugins_list`
npm i -D $gulp_plugins_list_file

echo " "

read -r -p " run gulp now? [y/N] " response_3
if [[ $response_3 =~ ^([yY])$ ]]; then
	echo " gulp launch..."
	gulp
fi