// Generated by CoffeeScript 1.6.3
(function() {
  var __slice = [].slice;

  (function($, window, document) {
    var Sidenote, SidenoteGroup, SidenotesPlugin, escapeExpression;
    $.fn.extend({
      sidenotes: function() {
        var args, option;
        option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this.each(function() {
          var $this, plugin, _ref;
          $this = $(this);
          plugin = (_ref = $this.data('sidenotes')) != null ? _ref : $this.data('sidenotes', new SidenotesPlugin(this, option));
          if (typeof option === 'string') {
            plugin[option].apply(plugin, args);
            if (option === 'destroy') {
              $this.removeData('sidenotes');
            }
          }
          return true;
        });
      }
    });
    SidenotesPlugin = (function() {
      SidenotesPlugin.prototype.options = {
        footnoteContainerSelector: '.footnotes',
        footnoteSelector: '> ol > li',
        initiallyHidden: false,
        removeRefMarkRegex: /(?!)/,
        refMarkClass: 'ref-mark',
        sidenoteClass: 'sidenote',
        sidenoteGroupClass: 'sidenote-group',
        sidenoteElement: 'aside',
        sidenoteGroupElement: 'div',
        sidenotePlacement: 'before',
        hideFootnoteContainer: true,
        formatSidenote: function(footnoteHtml, id, ref) {
          var $sidenote;
          $sidenote = $("<" + this.sidenoteElement + "/>", {
            "class": this.sidenoteClass
          }).html(footnoteHtml).attr('id', id);
          if (ref != null) {
            $sidenote.attr('data-ref', ref);
            $sidenote.prepend($('<span/>', {
              "class": this.refMarkClass
            }).html(ref));
          }
          return $sidenote;
        },
        formatSidenoteID: function(footnoteID) {
          return footnoteID.replace(/^f/, 's');
        },
        hide: function($el) {
          return $el.hide();
        },
        show: function($el) {
          return $el.show();
        }
      };

      function SidenotesPlugin(scope, options) {
        var plugin, refCounter;
        this.options = $.extend({}, this.options, options);
        this.options.sidenotePlacement = this.options.placement || this.options.sidenotePlacement;
        if (this.options.hideFootnoteContainer) {
          this.$footnoteContainer = $(this.options.footnoteContainerSelector, scope);
        }

	  console.log("footnoteContainer", this.$footnoteContainer, this.$footnoteContainer.length, this.$footnoteContainer.parent());

        this.$footnoteContainer = this.$footnoteContainer.length !== 0 ? this.$footnoteContainer : null;

        this.$postContainer = this.$footnoteContainer.parent();
        this.$footnotes = $(this.options.footnoteContainerSelector + ' ' + this.options.footnoteSelector, this.$postContainer);
        this.sidenotesAfterRef = this.options.sidenotePlacement === 'after';
        refCounter = 1;
        this.sidenotes = [];
        this.groups = [];
        plugin = this;
        this.$footnotes.each(function() {
          var footnoteEl, footnoteID, group, noRef, previous, sidenote, _ref;
          footnoteEl = this;
          footnoteID = footnoteEl.id;
          noRef = plugin.options.removeRefMarkRegex.test(footnoteID);
          sidenote = new Sidenote(footnoteEl, (noRef ? null : refCounter++), plugin);
          plugin.sidenotes.push(sidenote);
          previous = (_ref = plugin.sidenotes[plugin.sidenotes.length - 2]) != null ? _ref : null;
          if (previous != null ? previous.$pivot.is(sidenote.$pivot) : void 0) {
            if (previous.hasGroup()) {
              return previous.group.push(sidenote);
            } else {
              group = new SidenoteGroup([previous, sidenote], plugin);
              return plugin.groups.push(group);
            }
          }
        });
        this.isHidden = this.options.initiallyHidden;
        if (this.isHidden) {
          this.hide(true);
        } else {
          this.show(true);
        }
      }

      SidenotesPlugin.prototype.show = function(force) {
        var group, sidenote, _i, _j, _len, _len1, _ref, _ref1;
        if (this.isHidden || force) {
          _ref = this.sidenotes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sidenote = _ref[_i];
            if (force && !sidenote.hasGroup()) {
              sidenote.$pivot[this.sidenotePlacement()](sidenote.$sidenote);
            }
            sidenote.show();
          }
          _ref1 = this.groups;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            group = _ref1[_j];
            if (force) {
              group.$pivot[this.sidenotePlacement()](group.$group);
            }
            group.show();
          }
          if ((this.$footnoteContainer != null) && this.options.hideFootnoteContainer) {
            this.options.hide(this.$footnoteContainer);
          }
          return this.isHidden = false;
        }
      };

      SidenotesPlugin.prototype.hide = function(force) {
        var group, sidenote, _i, _j, _len, _len1, _ref, _ref1;
        if (!this.isHidden || force) {
          _ref = this.sidenotes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sidenote = _ref[_i];
            if (force && !sidenote.hasGroup()) {
              sidenote.$pivot[this.sidenotePlacement()](sidenote.$sidenote);
            }
            sidenote.hide();
          }
          _ref1 = this.groups;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            group = _ref1[_j];
            if (force) {
              group.$pivot[this.sidenotePlacement()](group.$group);
            }
            group.hide();
          }
          if (this.$footnoteContainer != null) {
            this.options.show(this.$footnoteContainer);
          }
          return this.isHidden = true;
        }
      };

      SidenotesPlugin.prototype.sidenotePlacement = function(placement, force) {
        var group, sidenote, _i, _j, _len, _len1, _ref, _ref1;
        if ((placement === 'before' || placement === 'after') && (placement !== this.sidenotePlacement() || force)) {
          _ref = this.sidenotes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sidenote = _ref[_i];
            if (!sidenote.hasGroup()) {
              sidenote.$pivot[placement](sidenote.$sidenote);
            }
          }
          _ref1 = this.groups;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            group = _ref1[_j];
            group.$pivot[placement](group.$group);
          }
          return this.sidenotesAfterRef = placement === 'after';
        } else {
          if (this.sidenotesAfterRef) {
            return 'after';
          } else {
            return 'before';
          }
        }
      };

      SidenotesPlugin.prototype.placement = function(placement, force) {
        return this.sidenotePlacement(placement, force);
      };

      SidenotesPlugin.prototype.destroy = function() {
        var group, sidenote, _i, _j, _len, _len1, _ref, _ref1, _results;
        this.hide();
        _ref = this.sidenotes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sidenote = _ref[_i];
          sidenote.$sidenote.remove();
        }
        _ref1 = this.groups;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          group = _ref1[_j];
          _results.push(group.$group.remove());
        }
        return _results;
      };

      return SidenotesPlugin;

    })();
    Sidenote = (function() {
      function Sidenote(footnoteEl, ref, owner) {
        var $backArrow, $referringFootnote, sidenote, _i, _len, _ref;
        this.$footnote = $(footnoteEl);
        this.owner = owner;
        this.footnoteID = footnoteEl.id;
        this.sidenoteID = this.owner.options.formatSidenoteID(this.footnoteID);
        this.ref = ref > 0 ? ref : null;
        this.$refMarkAnchor = $("a[href='#" + (escapeExpression(this.footnoteID)) + "']", this.owner.$postContainer);
        this.$refMarkSup = this.$refMarkAnchor.parent('sup');
        this.$refMarkSup = this.$refMarkSup.length !== 0 ? this.$refMarkSup : null;
        this.isNested = $.contains(this.owner.$footnoteContainer.get(0), this.refMark().get(0));
        if (this.isNested) {
          $referringFootnote = this.refMark().closest(this.owner.$footnotes);
          _ref = this.owner.sidenotes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sidenote = _ref[_i];
            if (sidenote.$footnote.is($referringFootnote)) {
              this.referringSidenote = sidenote;
              break;
            }
          }
        }
        this.refMarkID = this.refMark().attr('id');
        this.originalRef = this.$refMarkAnchor.html();
        this.$sidenote = this.owner.options.formatSidenote(this.$footnote.html(), this.sidenoteID, this.ref);
        this.$pivot = !this.isNested ? this.refMark().parentsUntil(this.owner.$postContainer).last() : this.referringSidenote.$pivot;
        this.group = null;
        $backArrow = $("a[href='#" + (escapeExpression(this.refMarkID)) + "']", this.$sidenote);
        if (($backArrow != null) && this.noMark()) {
          this.owner.options.hide($backArrow);
        }
        this.owner.options.hide(this.$sidenote);
        this.isHidden = true;
      }

      Sidenote.prototype.noMark = function() {
        return this.ref == null;
      };

      Sidenote.prototype.hasGroup = function() {
        return this.group != null;
      };

      Sidenote.prototype.show = function(force) {
        if (this.isHidden || force) {
          if (this.noMark()) {
            this.owner.options.hide(this.refMark());
          } else {
            this.$refMarkAnchor.html(this.ref);
            this.$refMarkAnchor.attr('href', "#" + this.sidenoteID);
          }
          this.owner.options.show(this.$sidenote);
          this.owner.options.hide(this.$footnote);
          return this.isHidden = false;
        }
      };

      Sidenote.prototype.hide = function(force) {
        if (!this.isHidden || force) {
          this.$refMarkAnchor.html(this.originalRef);
          this.$refMarkAnchor.attr('href', "#" + this.footnoteID);
          this.owner.options.show(this.refMark());
          this.owner.options.hide(this.$sidenote);
          this.owner.options.show(this.$footnote);
          return this.isHidden = true;
        }
      };

      Sidenote.prototype.refMark = function() {
        var _ref;
        return (_ref = this.$refMarkSup) != null ? _ref : this.$refMarkAnchor;
      };

      return Sidenote;

    })();
    SidenoteGroup = (function() {
      function SidenoteGroup(sidenotes, owner) {
        var _ref;
        this.sidenotes = [];
        this.owner = owner;
        this.$group = $("<" + this.owner.options.sidenoteGroupElement + "/>", {
          "class": this.owner.options.sidenoteGroupClass
        });
        this.push(sidenotes);
        this.$pivot = (_ref = this.sidenotes[0]) != null ? _ref.$pivot : void 0;
        this.owner.options.hide(this.$group);
        this.isHidden = true;
      }

      SidenoteGroup.prototype.push = function(s) {
        var sidenote, sidenotes, _i, _len, _ref;
        sidenotes = s instanceof Array ? s : [s];
        (_ref = this.sidenotes).push.apply(_ref, sidenotes);
        for (_i = 0, _len = sidenotes.length; _i < _len; _i++) {
          sidenote = sidenotes[_i];
          this.$group.append(sidenote.$sidenote);
          sidenote.group = this;
        }
        return this.$pivot != null ? this.$pivot : this.$pivot = this.sidenotes[0].pivot;
      };

      SidenoteGroup.prototype.show = function() {
        if (this.isHidden) {
          this.owner.options.show(this.$group);
          return this.isHidden = false;
        }
      };

      SidenoteGroup.prototype.hide = function() {
        if (!this.isHidden) {
          this.owner.options.hide(this.$group);
          return this.isHidden = true;
        }
      };

      return SidenoteGroup;

    })();
    return escapeExpression = function(str) {
      return str.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g, '\\$1');
    };
  })(jQuery, window, document);

}).call(this);

/*
//@ sourceMappingURL=jquery.sidenotes.map
*/
