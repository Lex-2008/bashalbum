bashalbum
=========

Simple HTML album generator written in bash.
Good addition to BashBlog, maybe?

Features
--------

- generates image sprite and appropriate HTML/CSS markup for files in a folder
- contains a simple javascript gallery viewer
- each image can have a description 
- integrates to bashblog used in same directory

Installation & configuration
----------------------------

- install ImageMagic or GraphicsMagick
- make a directory for your albums, say, `~/www/photos/`
- copy `album.js` to that folder
- if you're using bashblog, change balb.sh to point to bashblog.sh
- if you're *not* using bashblog, then you're at your own -- this script doesn't
  have any index.html generator

Usage
-----

- make a subdirectory for an album, say, `www/photos/2014-summer-trip`
- (optional) set timestamp of the directory to the date of the trip (will be
  copied to generated file)
- copy photos into the folder
- cd to parent directory and run balb.sh, passing a folder name *without
  trailing slash* as a first parameter, for example:

    cd ~/www/photos/ && ./balb.sh 2014-summer-trip

  It will generate an 2014-summer-trip.html file with a gallery of all images
  located in 2014-summer-trip folder, and 2014-summer-trip.jpg for all their
  previews (used in 2014-summer-trip.html page)
- (optional) edit the generated 2014-summer-trip.html file to add your text
  before &lt;!-- album begins --> or after &lt;!-- album ends -->
- (optional) edit the generated 2014-summer-trip.html file to add your
  description to every photo
  (look for comments section soon after &lt;!-- album begins --> line,
  it's prefilled with an empty string for each photo, nice!)
- When/if you add/remove/edit photos in relevant directory, re-run the same
  command to regenerate thumbnails and to refresh 2014-summer-trip.html file.
  Your text and comments should be preserved.

