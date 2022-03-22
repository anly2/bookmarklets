javascript: (function() {
    /* Configurable */
    const keepN = 200;
    const fadeFromColor = "black";
    const fadeToColor = "darkgray";
    const fadeDuration = "1800s";

    /* Helper functions */

    function addStylesheet(css) {
        var e = document.createElement('div');
        e.innerHTML = "<style>" + css + "</style>";
        document.body.appendChild(e);
    }

    function getSelectionElements() {
        if (!!window.getSelection) {
            var sel = window.getSelection();
            var elements = [];
            for (var i = 0; i < sel.rangeCount; i++) {
                var node = sel.getRangeAt(i).commonAncestorContainer;
                elements.push(node.nodeType === 1 ? node : node.parentNode);
            }
            return elements;
        } else if (!!document.selection && document.selection.type !== "Control") {
            var textRange = document.selection.createRange();
            return [textRange.parentElement()];
        }
    }

    var defer = (function() {
        var bulk = [];
        var timeout;
        return function(action) {
            bulk.push(action);
            if (!timeout) {
                timeout = setTimeout(function() {
                    var actions = bulk;
                    bulk = [];
                    actions.forEach(function(a) { a(); });
                    timeout = undefined;
                }, 100)
            }
            return timeout;
        };
    }());


    /* Functionality */

    const shortest_unit = (function() {
        const units = [
            {"name": "second", "value": 1000},
            {"name": "minute", "value": 60 * 1000},
            {"name": "hour", "value": 60 * 60 * 1000},
            {"name": "day", "value": 24 * 60 * 60 * 1000}
        ];
        return function(timediff) {
            for (let i = 1; i < units.length; i++) {
                if (timediff < units[i].value) {
                    return units[i - 1];
                }
            }
            return units[units.length - 1];
        };
    }());

    function timediff_inWords(d, u) {
        var n = Math.floor(d / u.value);
        return ((0 <= n && n < 10) ? " " : "") + n + u.name.charAt(0) + " ago ";
    }


    addStylesheet([
        ".ager {",
        "    color: "+fadeFromColor+";",
        "    transition: color "+fadeDuration+";",
        "}"
    ].join("\n"));

    var agers = window.agers || ((keepN > 0) && []);
    window.agers = agers;
    if (agers && !window.agerTickInterval) {
        window.agerTickInterval = setInterval(function() { for (var a of agers) a.tick(); }, 1000);
    }

    function prepareAger(element) {
        const t = element.getAttribute('data-instant');
        let diff = new Date() - new Date(t);
        const update = function() {
            element.innerHTML = timediff_inWords(diff, shortest_unit(diff));
        };
        update(diff);

        defer(function() {
            element.style.transitionDelay = "-" + Math.floor(diff / 1000) + "s";
            element.style.color = fadeToColor;
        });

        const ager = {
            tick: function() {
                diff += 1000;
                update();
            },
            clear: function() {
                element.remove();
            }
        };

        if (agers) {
            agers.push(ager);
            if (agers.length > keepN) {
                agers.shift().clear();
            }
        }

        return ager;
    }

    const regexMoment = /(?:(\d{4}|\d{2})-(\d{1,2})-(\d{1,2}))?\s*T?\s*(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(?:\s*(Z|[A-Z]{2,3}))?(?:\s*([+-]\d{2}))?/g;
    function normalizeDateString(matchGroups) {
        const [whole, year, month, day, hours, minutes, seconds, millis, zone, offset] = matchGroups;

        const instant = Date.parse(whole);
        if (!isNaN(instant)) {
            return new Date(instant).toISOString();
        }

        const now = new Date();
        const y = (year && (year.length > 2 ? year : "20" + year)) || now.getFullYear();
        const m = month || (now.getMonth() + 1);
        const d = day || now.getDate();
        const s = seconds || now.getSeconds();
        const ms = millis || now.getMilliseconds();
        const z = ((zone || "") + (offset || "")) || "Z";

        const datetime = y+"-"+m+"-"+d+" "+hours+":"+minutes+":"+s+"."+ms;
        if (!isNaN(Date.parse(datetime+" "+z))) {
            return datetime+" "+z;
        }
        return datetime;
    }


    /* Action */

    const sel = getSelectionElements();
    console.log("Selected elements:", sel);
    (sel || [document.body]).forEach(element => {
        let foundSome = false;
        element.innerHTML = element.innerHTML.replace(regexMoment, function(w) {
            const t = normalizeDateString(Array.from(arguments));
            console.log("Found a datetime string:", w, "normalized to:", t);
            foundSome = true;
            return " <span class='ager' data-instant='"+t+"'></span> " + w;
        });
        if (foundSome) {
            Array.from(element.querySelectorAll('.ager')).forEach(elem => prepareAger(elem));
        }
    });

}());
void 0;