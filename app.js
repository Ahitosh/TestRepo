var myApp=angular.module("ui.bootstrap.timepicker", []).constant("timepickerConfig", {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: !0,
    meridians: null,
    readonlyInput: !1,
    mousewheel: !0
}).controller("TimepickerController", ["$scope", "$attrs", "$parse", "$log", "$locale", "timepickerConfig", function(n, t, i, r, u, f) {
    function p() {
        var t = parseInt(n.hours, 10),
            i = n.showMeridian ? t > 0 && t < 13 : t >= 0 && t < 24;
        return i ? (n.showMeridian && (t === 12 && (t = 0), n.meridian === v[1] && (t = t + 12)), t) : undefined
    }

    function w() {
        var t = parseInt(n.minutes, 10);
        return t >= 0 && t < 60 ? t : undefined
    }

    function l(n) {
        return angular.isDefined(n) && n.toString().length < 2 ? "0" + n : n
    }

    function a(n) {
        b();
        o.$setViewValue(new Date(e));
        y(n)
    }

    function b() {
        o.$setValidity("time", !0);
        n.invalidHours = !1;
        n.invalidMinutes = !1
    }

    function y(t) {
        var i = e.getHours(),
            r = e.getMinutes();
        n.showMeridian && (i = i === 0 || i === 12 ? 12 : i % 12);
        n.hours = t === "h" ? i : l(i);
        n.minutes = t === "m" ? r : l(r);
        n.meridian = e.getHours() < 12 ? v[0] : v[1]
    }

    function s(n) {
        var t = new Date(e.getTime() + n * 6e4);
        e.setHours(t.getHours(), t.getMinutes());
        a()
    }
    var e = new Date,
        o = {
            $setViewValue: angular.noop
        },
        v = angular.isDefined(t.meridians) ? n.$parent.$eval(t.meridians) : f.meridians || u.DATETIME_FORMATS.AMPMS,
        h, c;
    this.init = function(i, r) {
        o = i;
        o.$render = this.render;
        var u = r.eq(0),
            e = r.eq(1),
            s = angular.isDefined(t.mousewheel) ? n.$parent.$eval(t.mousewheel) : f.mousewheel;
        s && this.setupMousewheelEvents(u, e);
        n.readonlyInput = angular.isDefined(t.readonlyInput) ? n.$parent.$eval(t.readonlyInput) : f.readonlyInput;
        this.setupInputEvents(u, e)
    };
    h = f.hourStep;
    t.hourStep && n.$parent.$watch(i(t.hourStep), function(n) {
        h = parseInt(n, 10)
    });
    c = f.minuteStep;
    t.minuteStep && n.$parent.$watch(i(t.minuteStep), function(n) {
        c = parseInt(n, 10)
    });
    n.showMeridian = f.showMeridian;
    t.showMeridian && n.$parent.$watch(i(t.showMeridian), function(t) {
        if (n.showMeridian = !!t, o.$error.time) {
            var i = p(),
                r = w();
            angular.isDefined(i) && angular.isDefined(r) && (e.setHours(i), a())
        } else y()
    });
    this.setupMousewheelEvents = function(t, i) {
        var r = function(n) {
            n.originalEvent && (n = n.originalEvent);
            var t = n.wheelDelta ? n.wheelDelta : -n.deltaY;
            return n.detail || t > 0
        };
        t.bind("mousewheel wheel", function(t) {
            n.$apply(r(t) ? n.incrementHours() : n.decrementHours());
            t.preventDefault()
        });
        i.bind("mousewheel wheel", function(t) {
            n.$apply(r(t) ? n.incrementMinutes() : n.decrementMinutes());
            t.preventDefault()
        })
    };
    this.setupInputEvents = function(t, i) {
        if (n.readonlyInput) {
            n.updateHours = angular.noop;
            n.updateMinutes = angular.noop;
            return
        }
        var r = function(t, i) {
            o.$setViewValue(null);
            o.$setValidity("time", !1);
            angular.isDefined(t) && (n.invalidHours = t);
            angular.isDefined(i) && (n.invalidMinutes = i)
        };
        n.updateHours = function() {
            var n = p();
            angular.isDefined(n) ? (e.setHours(n), a("h")) : r(!0)
        };
        t.bind("blur", function() {
            !n.invalidHours && n.hours < 10 && n.$apply(function() {
                n.hours = l(n.hours)
            })
        });
        n.updateMinutes = function() {
            var n = w();
            angular.isDefined(n) ? (e.setMinutes(n), a("m")) : r(undefined, !0)
        };
        i.bind("blur", function() {
            !n.invalidMinutes && n.minutes < 10 && n.$apply(function() {
                n.minutes = l(n.minutes)
            })
        })
    };
    this.render = function() {
        var n = o.$modelValue ? new Date(o.$modelValue) : null;
        isNaN(n) ? (o.$setValidity("time", !1), r.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (n && (e = n), b(), y())
    };
    n.incrementHours = function() {
        s(h * 60)
    };
    n.decrementHours = function() {
        s(-h * 60)
    };
    n.incrementMinutes = function() {
        s(c)
    };
    n.decrementMinutes = function() {
        s(-c)
    };
    n.toggleMeridian = function() {
        s(720 * (e.getHours() < 12 ? 1 : -1))
    }
}]).directive("timepicker", function() {
    return {
        restrict: "EA",
        require: ["timepicker", "?^ngModel"],
        controller: "TimepickerController",
        replace: !0,
        scope: {},
        templateUrl: "template/timepicker/timepicker.html",
        link: function(n, t, i, r) {
            var f = r[0],
                u = r[1];
            u && f.init(u, t.find("input"))
        }
    }
});
