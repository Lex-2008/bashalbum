bashalbum
=========

Simple HTML album generator written in bash.
Good addition to BashBlog, maybe?

Features
--------

- generates image sprite and appropriate HTML/CSS markup for files in a folder
- contains a simple javascript gallery viewer
- each image can have descriptions in several languages
- integrates to [bashblog](https://github.com/cfenollosa/bashblog) used in same directory

Installation
------------

- install ImageMagic or GraphicsMagick
- make a directory for your albums, say, `~/www/photos/`
- copy `album.js` to that folder

Configuration
-------------

Edit balb.sh:
- change `bb` to point to `bashblog.sh`, or leave empty if you're not using bashblog
- change `langs` to the list of languages you're going to use, or leave empty
  if you're going to write comments in one language only.
  Note that the first language is the _fallback_ language, i.e. when no other
  language matches user's preferred language, first one is selected.
  Also note that this option is taken into account only when generating html file
  for the first time. On further updates, comments section is preserved intact.
  To change this behavior, delete comments section and run `balb` again - it
  will recreate the comments section

Usage
-----

- make a subdirectory for an album, say, `~/www/photos/2014-summer-trip`
- (optional) set timestamp of the directory to the date of the trip (will be
  copied to generated file)
- copy photos into the folder
- cd to parent directory and run `balb.sh`, passing a folder name *without
  trailing slash* as a first parameter, for example:

    cd ~/www/photos/ && ./balb.sh 2014-summer-trip

  It will generate an `2014-summer-trip.html` file with a gallery of all images
  located in `2014-summer-trip` folder, and `2014-summer-trip.jpg` for all their
  previews (used in `2014-summer-trip.html` page)

Editing
-------

If you're using bashblog, then add `edit` argument for `balb.sh`, like this:

    ./balb.sh edit 2014-summer-trip

It will call `bb.sh`, which will use your $EDITOR to edit the file. With future
versions of bashblog, you'll be able to rename file and folder this way.

Things you can edit:
- add your text before `&lt;!-- album begins -->` or after `&lt;!-- album ends -->`
- add your description to every photo
  (look for comments section soon after `&lt;!-- album begins -->` line,
  it's prefilled with an empty string for each photo, nice!)
