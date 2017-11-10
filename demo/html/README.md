HTML Gotchas
-----

Current breaking selectors found:

@-ms-
:-ms-
::
:valid
:invalid
+.
:-


If you have a selector that does not work with the current version of CSS selector detection, then add it to the "special_reduce_with_html_ignore_selectors" option in config_css.json.

The type of error message will be similar to the following:


SyntaxError: Unknown pseudo-class selector ":invalid"