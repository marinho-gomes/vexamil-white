var QuickAccord = { DATA_ATTR_TARGET: "data-accord-target", DATA_ATTR_GROUP: "data-accord-group", CLASS_EXPANDED: "expanded", CLASS_COLLAPSED: "collapsed", CLASS_ANIMATING: "is-animating" };
!(function (r) {
    r.fn.QuickAccord = function (e) {
        return this.filter("a,[" + QuickAccord.DATA_ATTR_TARGET + "]").each(function () {
            var e = { _$this: r(this) },
                t = {
                    init: function () {
                        var r = e._$this,
                            c = r.attr(QuickAccord.DATA_ATTR_TARGET) || r.attr("href") || null;
                        if (c) {
                            var a = /^#(\w+)/i.exec(c);
                            a && r.attr("aria-controls", a[1]);
                        }
                        t.isExpanded() ? t.expand() : t.collapse(), r.off("click", t._handler_trigger_click), r.on("click", t._handler_trigger_click);
                    },
                    destroy: function () {
                        var c = e._$this;
                        c.removeClass(CLASS_EXPANDED), c.removeClass(CLASS_COLLAPSED), c.removeAttr("aria-expanded"), c.removeAttr("aria-controls"), c.off("click", t._handler_trigger_click);
                        var a = t._resolveTargets(c);
                        a &&
                            (a.css("height", "auto"),
                            a.removeClass(QuickAccord.CLASS_EXPANDING),
                            a.removeClass(QuickAccord.CLASS_EXPANDED),
                            a.removeClass(QuickAccord.CLASS_COLLAPSING),
                            a.removeClass(QuickAccord.CLASS_COLLAPSED),
                            a.removeAttr("aria-expanded"),
                            a.each(function () {
                                QuickAccord.TransitionHelper.offTransitionComplete(r(this));
                            }));
                    },
                    _handler_trigger_click: function (r) {
                        return r.preventDefault(), t.toggle(), !1;
                    },
                    toggle: function (r) {
                        t.isExpanded() ? t.collapse(r) : t.expand(r);
                    },
                    collapse: function (c) {
                        (c = c || e._$this).removeClass(QuickAccord.CLASS_EXPANDED), c.addClass(QuickAccord.CLASS_COLLAPSED), c.attr("aria-expanded", "false");
                        var a = t._resolveTargets(c);
                        if (!a) throw new Error("Could not resolve target");
                        a.each(function () {
                            var e = r(this);
                            e.outerHeight() > 0 && (e.addClass(QuickAccord.CLASS_ANIMATING), QuickAccord.TransitionHelper.onTransitionComplete(e, t._handler_collapse_complete), e.css("height", "0"));
                        }),
                            a.attr("aria-expanded", "false");
                    },
                    _handler_collapse_complete: function (e) {
                        var t = r(e.target);
                        QuickAccord.TransitionHelper.offTransitionComplete(t), t.removeClass(QuickAccord.CLASS_ANIMATING), t.removeClass(QuickAccord.CLASS_EXPANDED), t.addClass(QuickAccord.CLASS_COLLAPSED);
                    },
                    expand: function (c) {
                        (c = c || e._$this).removeClass(QuickAccord.CLASS_COLLAPSED), c.addClass(QuickAccord.CLASS_EXPANDED), c.attr("aria-expanded", "true");
                        var a = c.attr(QuickAccord.DATA_ATTR_GROUP) || null;
                        a &&
                            r("[" + QuickAccord.DATA_ATTR_GROUP + "='" + a + "']")
                                .filter("a,[" + QuickAccord.DATA_ATTR_TARGET + "]")
                                .not(c)
                                .each(function () {
                                    t.collapse(r(this));
                                });
                        var i = t._resolveTargets(c);
                        if (!i) throw new Error("Could not resolve target");
                        i.each(function () {
                            var e = r(this),
                                c = e.hasClass(QuickAccord.CLASS_EXPANDED) && !e.hasClass(QuickAccord.CLASS_ANIMATING),
                                a = e.outerHeight();
                            e.css("height", "auto");
                            var i = e.outerHeight();
                            c || (e.addClass(QuickAccord.CLASS_ANIMATING), QuickAccord.TransitionHelper.onTransitionComplete(e, t._handler_expand_complete), e.css("height", a + "px")), e.css("height"), e.css("height", i + "px");
                        }),
                            i.removeClass(QuickAccord.CLASS_COLLAPSED),
                            i.addClass(QuickAccord.CLASS_EXPANDED),
                            i.attr("aria-expanded", "true");
                    },
                    _handler_expand_complete: function (e) {
                        var t = r(e.target);
                        QuickAccord.TransitionHelper.offTransitionComplete(t), t.removeClass(QuickAccord.CLASS_ANIMATING), t.removeClass(QuickAccord.CLASS_COLLAPSED), t.addClass(QuickAccord.CLASS_EXPANDED);
                    },
                    isExpanded: function (c) {
                        if ((c = c || e._$this).hasClass(QuickAccord.CLASS_COLLAPSED)) return !1;
                        if (c.hasClass(QuickAccord.CLASS_EXPANDED)) return !0;
                        var a = t._resolveTargets(c);
                        if (a && a.length) {
                            var i = r(a[0]);
                            if (i.hasClass(QuickAccord.CLASS_EXPANDED)) return !0;
                            if (i.hasClass(QuickAccord.CLASS_COLLAPSED)) return !1;
                        }
                        return !1;
                    },
                    _resolveTargets: function (e) {
                        var t = null,
                            c = e.attr(QuickAccord.DATA_ATTR_TARGET) || e.attr("href") || null;
                        return c && (t = r(c)), t;
                    },
                };
            (this.quickAccord = { init: t.init, destroy: t.destroy, toggle: t.toggle, collapse: t.collapse, expand: t.expand, isExpanded: t.isExpanded }), t.init();
        });
    };
})(jQuery),
    (QuickAccord.TransitionHelper = (function () {
        for (
            var r = null,
                e = null,
                t = [
                    ["webkitTransition", "webkitTransitionEnd", "-webkit-"],
                    ["transition", "transitionend", ""],
                ],
                c = t.length,
                a = 0;
            a < c && void 0 === document.documentElement.style[t[a][0]];
            a++
        );
        a != c && ((r = t[a][1]), (e = t[a][2]));
        var i = {
            hasTransition: function (r) {
                var t = r[0];
                return void 0 !== document.documentElement.currentStyle ? parseFloat(t.currentStyle[e + "transition-duration"]) > 0 : parseFloat(window.getComputedStyle(t)[e + "transition-duration"]) > 0;
            },
            onTransitionComplete: function (e, t) {
                r && i.hasTransition(e) ? e.on(r, t) : t({ target: e[0] });
            },
            offTransitionComplete: function (e, t) {
                r && (void 0 !== t ? e.off(r, t) : e.off(r));
            },
        };
        return i;
    })());
