CategoryTypeahead
=================

short description
A powerful bootstrap typeahead now can return result with category, item id

Orginal typeahead can only search String, update string, it's not good for all

1. It can return id instead of string when you pick your search
2. Your search result can be categoried, those has same category will list together, just like the spotlight on macbook


/*How to use the searchBox
 * 
 * function definition
 *  startSearchBox(input, dataSource, target, showWaitIconAhead, delay) 
 *  @param input the input box you want to inject
 *  @param dataSource: 1. a string Array ["aaaa","bbbb"]
 *      2. a item Array, item is an object with three field: id, text, and category [{id:1, text:"the text to display", category:"warning"}]
 *      3. a restful server, for example: 'rest/search-vendor'. the request will be sent as 'rest/search-vendor/{query}'. receving a JSON 
 *  @target a string to navigator to, eg: somewhere?id=@id. Or a function with a param item{id, text, category}
 *  @param showWaitIconAhead if true the wait icon will show before the input
 *  @param delay the ms delay to display. default 700
 * 
Example 1, search string locally startSearchBox($("input[name=query]"), ["This is the first string", "this is the second string"], function(item) {
        alert(item.text || item);
    });
    
Example 2, search locally with category
    startSearchBox($("input[name=query]"), [{id:1, text:"the text to display", category:"warning"},{id:3, text:"third text to display", category:"warning"},{id:2, text:"second text to display", category:"notification"}], function(item) {
        alert(item.text || item);
    });
    
Example 3, 
     startSearchBox($("input[name=query]"), "somewhere-to-search-data", function(item) {
        alert(item.text || item);
    });
*/

/* =============================================================
 * Enhancement of bootstrap-typeahead.js v2.3.1
 * https://github.com/runzhi/bootstrap-categoryTypeahead
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 */
