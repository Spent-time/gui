define([

        'dojox/charting/Theme',
        'dojox/gfx/gradutils',
        'dojox/charting/themes/common'],

    function (Theme, gradutils, themes) {

        var g = Theme.generateGradient,
            defaultFill = {type: "linear", space: "shape", x1: 0, y1: 0, x2: 0, y2: 100};

        themes.Claro = new Theme({
            chart: {
                fill: '#252830',
                stroke: {color: '#252830'}
            },
            plotarea: {
                fill: '#252830',
                stroke: '#252830'
            },
            axis: {
                stroke: { // the axis itself
                    color: "#252830",
                    width: 1
                },
                tick: {	// used as a foundation for all ticks
                    color: "#888c76",
                    position: "center",
                    font: "normal normal normal 7pt Verdana, Arial, sans-serif",	// labels on axis
                    fontColor: "#888c76"								// color of labels
                }
            },
            series: {
                stroke: {width: 4, color: "#252830"},
                outline: null,
                font: "normal normal normal 7pt Verdana, Arial, sans-serif",
                fontColor: "#131313"
            },
            marker: {
                stroke: {width: 1.25, color: "#131313"},
                outline: {width: 1.25, color: "#131313"},
                font: "normal normal normal 8pt Verdana, Arial, sans-serif",
                fontColor: "#131313"
            },
            seriesThemes: [
                {fill: g(defaultFill, "#2a6ead", "#3a99f2")},
                {fill: g(defaultFill, "#613e04", "#996106")},
                {fill: g(defaultFill, "#0e3961", "#155896")},
                {fill: g(defaultFill, "#55aafa", "#3f7fba")},
                {fill: g(defaultFill, "#ad7b2a", "#db9b35")}
            ],
            markerThemes: [
                {fill: "#2a6ead", stroke: {color: "#fff"}},
                {fill: "#613e04", stroke: {color: "#fff"}},
                {fill: "#0e3961", stroke: {color: "#fff"}},
                {fill: "#55aafa", stroke: {color: "#fff"}},
                {fill: "#ad7b2a", stroke: {color: "#fff"}}
            ]
        });

        themes.Claro.next = function (elementType, mixin, doPost) {
            var isLine = elementType == "line",
                s, theme;
            if (isLine || elementType == "area") {
                // custom processing for lines: substitute colors
                s = this.seriesThemes[this._current % this.seriesThemes.length];
                var m = this.markerThemes[this._current % this.markerThemes.length];
                s.fill.space = "plot";
                if (isLine) {
                    s.stroke = {width: 4, color: s.fill.colors[0].color};
                }
                m.outline = {width: 1.25, color: m.fill};
                theme = Theme.prototype.next.apply(this, arguments);
                // cleanup
                delete s.outline;
                delete s.stroke;
                s.fill.space = "shape";
                return theme;
            } else if (elementType == "candlestick") {
                s = this.seriesThemes[this._current % this.seriesThemes.length];
                s.fill.space = "plot";
                s.stroke = {width: 1, color: s.fill.colors[0].color};
                theme = Theme.prototype.next.apply(this, arguments);
                return theme;
            }
            return Theme.prototype.next.apply(this, arguments);
        };

        themes.Claro.post = function (theme, elementType) {
            theme = Theme.prototype.post.apply(this, arguments);
            if ((elementType == "slice" || elementType == "circle") && theme.series.fill && theme.series.fill.type == "radial") {
                theme.series.fill = gradutils.reverse(theme.series.fill);
            }
            return theme;
        };

        return themes.Claro;
    });
