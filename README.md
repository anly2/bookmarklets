# AA Bookmarklets

A collection of javascript snippets that can be ran as bookmarklets in the browser on any page.

## Usage

To use these as bookmarklets:
 1. minimize the code as necessary (should not really need to do this)
 2. urlEncode so that special symbols like whitespace does not break the scripts
 3. create a bookmark in your browser of choice (`Ctrl + D`) and paste the snippet in the location/url field
 
There should already be sibling files with a `.min.url` extension which have the minimized and urlEconded code ready for copying.
Just triple click those long lines and paste them in a bookmark.

## Examples

### Ager

A bookmarklet that adds an agin text besides the selection in a webpage.
The aging text shows how long ago the selected datetime/instant was, updating every second.

You can run it on these samples:  
Lorem ipsum 2022-03-20 dolor sit amet 21:41  
Or a fuller datetime 2022-03-21T21:23:44Z  
potentially with offset: 2022-03-21T21:23:44+0000
(Anything javascript's Date.parse can handle, really, plus a bit more)

![docs/ager.png]