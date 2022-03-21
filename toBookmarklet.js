javascript:
var t = prompt('JS snippet to convert to bookmarklet');
t = t && prompt("Bookmarklet: (copy)\nAlso encode in base64?",
    encodeURI(t
        .replace(/(\s)\s+/g, '$1')
        .replace(/^(?:javascript:)?\s*/, 'javascript:')
        .replace(/void\s+0;?$/, 'void 0;')));
t = t && prompt("Bookmarklet: (copy)",
    "javascript:eval(atob('" + btoa(decodeURI(t).replace(/^javascript:/, '')) + "'));void 0;");
void 0;
