#!/usr/bin/env bash

# BashAlbum, a simple album generator written in bash. Good addition to BashBlog, maybe?
#
# Greately inspired by:
# BashBlog by Carlos Fenollosa - https://github.com/carlesfe/bashblog/
# Bash script for a simple html image gallery by Ian MacGregor (aka ardchoille) - https://snipt.net/ardchoille42/bash-script-for-a-simple-html-image-gallery/
# buildSprite.sh by jaymz campbell - http://jaymz.eu/blog/2010/05/building-css-sprites-with-bash-imagemagick/

# size of thumbnails
size=100

#type of files
ext=(jpg jpeg JPG JPEG)

# comments languages
langs=(en ru)

# path to bashblog, if any
bb=~/bashblog/bb.sh

# sed expr to make a nice title from filename
default_title_sed='s/^[0-9]*[-_]//;s/\.[^.]*$//;s/[-_]\+/ /g'

IFS=$'\n'

if [ "$1" == "edit" ]; then
	[ ! -d $2 ] && exit 2 # must be a directory
	[ ! -f $2.html ] && exit 3 # relevant file must exist
	EDITOR="eval $EDITOR >\"$(tty)\""
	$bb edit -n $2.html | {
		while read line; do
			echo "$line"
			if [[ "$line" = "Posted"* ]]; then
				newname="$(expr "$line" : "Posted \(.*\).html")"
			fi
		done
		if [[ "$newname" && "$newname" != "$2" ]]; then
			echo "moving [$2] to [$newname]"
			mv $2 $newname
			rm $2.$ext
			$0 $newname
		fi
	}
	exit 0
fi

[ $# -lt 1 ] && exit 1 # must have an argument
[ ! -d $1 ] && exit 2 # must be a directory

if [ ! -f $1.html ]; then
	echo "Creating empty file..."
	if [ -f "$bb" ]; then
		cat <<-EOT >$1.tmp.html
			$1
			<hr>
			<!-- album begin -->
			<!-- album end -->
		EOT
		EDITOR="cp $1.tmp.html"
		echo 'p' | $bb post -html
		rm $1.tmp.html
	else
		cat <<-EOT >$1.html
			<!doctype html><head>
			<meta encoding="utf-8">
			<title>$1</title>
			</head><body>
			<!-- album begin -->
			<!-- album end -->
			</body></html>
		EOT
	fi
	touch -r $1/ $1.html
fi

echo "Creating list of files to process..."
rm $1.list 2>/dev/null
for a in ${ext[*]}; do
	ls $1/*.$a >> $1.list 2>/dev/null
done

echo "Creating thumbnails..."
convert -strip -thumbnail ${size}x${size} -raise 3x3 -gravity center -extent ${size}x${size} -append @$1.list $1.$ext

echo "Creating HTML..."
rm $1.inc.html 2>/dev/null
# list all files
files=()
files_length=0
while read -r line; do
	files[$files_length]="${line##*/}" # save only filenames
	let files_length++
done <$1.list

addFilesLines() {
	if [ "${langs}" = "" ]; then
		# no langs
		for f in ${files[*]}; do
			ffn="$(echo "$f" | sed "$default_title_sed")"
			echo "'$f': '$ffn'," >>$1.inc.html
		done
	else
		for f in ${files[*]}; do
			ff="'$f': {" # formatted filename
			ffn="$(echo "${f%%.*}" | sed "$default_title_sed")"
			ffs="$(printf "%${#ff}s" ' ')"
			for l in ${langs[*]}; do
				# set $end to brace for the last line, to comma for all others
				[ $l == ${langs[${#langs[*]}-1]} ] && end='},' || end=','
				echo "$ff'$l':'$ffn'$end" >>$1.inc.html
				# all lines, starting with second, should have spaces instead of full name
				ff="$ffs"
			done
		done
	fi
}

# copy all comment lines
# also note which files have a comment
cat $1.html | awk '/<script>\s*comments/, /<\/script>/{ print }' | while read -r line; do
	# loop through all $files, if current line matches it -- delete it from $files
	for f in $(seq 0 $files_length); do
		if [[ "$line" =~ "'${files[$f]}': "* ]]; then
			unset files[$f]
			break
		fi
	done
	# before last line, print remaining $files
	if [[ "$line" = *"/script"* ]]; then
		addFilesLines $1
	fi
	echo "$line" >>$1.inc.html
done

# if above loop didn't happen - add a new comments section
if [ ! -f $1.inc.html ]; then
	echo 'Adding new comments section!'
	echo "<script>comments={ //you can edit comments below, but please don't change this line" >>$1.inc.html
	addFilesLines $1
	echo "}</script> <!-- please don't change this line or anything below -->" >>$1.inc.html
fi

cat <<EOT >>$1.inc.html
<style>.thumbnails a{background: url('$1.jpg'); width:${size}px; height:${size}px}</style>
<div class="viewer" style="display: none"><span></span><img></div>
<div class="text"></div>
<div class="thumbnails">
EOT
offset=0
while read -r line; do
     echo "<a href=\"$line\" style=\"background-position: 0 -${offset}px\"></a>" >> $1.inc.html
     let offset+=size
done <$1.list
echo "</div> <!-- thumbnails -->" >> $1.inc.html
echo "<script src=\"album.js\"></script>" >> $1.inc.html

echo "Patching file..."
touch -r $1.html $1/
cp $1.html $1.html.bak
    awk '/<!-- album begin -->/{
		print
		while ((getline line < "'$1.inc.html'") > 0)
			print line
		close("'$1.inc.html'")
		while (getline > 0 && !/<!-- album end -->/) {}
        } 1' $1.html.bak >$1.html
touch -r $1/ $1.html

rm $1.list $1.html.bak $1.inc.html
echo "Done!"
