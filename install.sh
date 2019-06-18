#!/bin/bash

echo " "
echo " GULPFILE BY N.Kh."
echo " "
echo " Link: https://github.com/NKh95/gulpfile_by_nkh.git"
echo " version: 1.0.0"
echo " "
echo " Select preprocessor type:"
echo "   1) SCSS (default)"
echo "   2) SASS"
echo " "

SASS="var PREPROCESSOR_TYPE='sass';"
SCSS="var PREPROCESSOR_TYPE='scss';"

read  value_from_user

if  [[ $value_from_user == 1 ]]; then

	sed -i "s/.*$SASS.*/$SCSS/" gulpfile.js

	dir_type="scss"

	echo " "
	echo " You choosed scss."

elif  [[ $value_from_user == 2 ]]; then

	sed -i "s/.*$SCSS.*/$SASS/" gulpfile.js

	dir_type="sass"

	echo " "
	echo " You choosed sass."

else

	sed -i "s/.*$SASS.*/$SCSS/" gulpfile.js

	dir_type="scss"

	echo " "
	echo " default (scss)."
fi


mkdir -p app/{js,css,$dir_type,fonts,img}
mkdir -p dist

cd app
	touch index.html

	cd js
		touch script.js
	cd ..

	cd  $dir_type
		touch main.$dir_type
	cd ..
cd ..

touch .gitignore
read -r first_line < .gitignore

if [[ $first_line != "node_modules" ]]; then
	echo "node_modules" >> .gitignore
fi

echo " "
echo " Install/reinstall npm packages."
echo " "

npm init -y;
npm i -D gulp gulp-sass gulp-concat gulp-clean-css gulp-uglify gulp-htmlmin gulp-debug browser-sync gulp-autoprefixer gulp-sourcemaps node-normalize-scss;
