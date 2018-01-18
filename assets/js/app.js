'use strict';
/*global $:false */

var components = {
  utils: {
    getArgs: function($element) {
      try {
        return eval('(' + $element.attr('js-args') + ')') || {};
      } catch(ex) {
        return {};
      }
    }
  },
  get : function(selector) {
    return $(selector).data('js-component');
  }
};

var bindJSControllers = function() {
  $('[js-component]').each(function() {
    var $element = $(this);
    if (!$element.data('js-component-loaded')) {
      var handler = $(this).attr('js-component');
      var handler = $(this).attr('js-component');
      var options = components.utils.getArgs($element);
      var api = new components[handler]($element, options);
      $element.data('js-component-loaded', true);
      $element.data('js-component-loaded', true);
      $element.data('js-component', api);
      $element.data('js-component', api);
      console.log('Loaded component ' + handler);
    } else {
      console.log('! Component ' + handler + ' is already loaded');
    }
  });
};

/*
 * Container
 * A controller for entire pages. Used for example to deal with full page
 * fade in and out transitions
 */
components.page = function($element, options) {
    var api = {};
    var defaults = {};
    var settings = $.extend({}, defaults, options);

    $(window).on('load', function(){
        $element.addClass('loaded');
    });

    // We fade the container out when navigation away from the page. We need to
    // allow for mailto and rel links though so we hack around those
    var unloadCallback = function(event) {
        $element.addClass('unloading');
    }
    $('a[href^="mailto:"],a[href^="tel:"]').hover(
        function(event){
            $(window).off('beforeunload');
        },
        function(event) {
            $(window).on('beforeunload', unloadCallback);
        });
    $(window).on('beforeunload', unloadCallback);

    return api;
}

components.menu = function($element, options) {
    var api = {};
    var defaults = {
    };
    var settings = $.extend({}, defaults, options);

    var $body = $('body');
    var $page = $('.page');
    var $content = $('.content');

    var $menuItems = $element.find('[js-menu-item]');
    var openCls = 'menu--open';
    var visible = false;

    api.open = function() {
        visible = true;
        $body.addClass(openCls);
    };

    api.close = function() {
        visible = false;
        $body.removeClass(openCls);
    };

    api.toggle = function() {
        if (visible) {
            api.close();
        } else {
            api.open();
        }
    }

    // Close the menu before redirecting
    $menuItems.click(function(){
        var that = this;
        api.close();
        setTimeout(function(){
            window.location = $(that).find('a').attr('href');
        }, 300);
        return false;
    });

    // Swiping open/close
    delete Hammer.defaults.cssProps.userSelect;
    var bodySwipe = new Hammer($body[0]);
    bodySwipe.on('swiperight', function(event){
        api.close();
    });
    bodySwipe.on('swipeleft', function(event){
        api.open();
    });

    // Click page close
    $content.on('click', function(event){
        api.close();
    });

    // Close menu on escape
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            api.close();
        }
    });

    return api;
};

components.menuTrigger = function($element, options) {
  // deal with opening/closing sidebar nav menu
  $element.on('click', function(){
    components.get('[js-component="menu"]').toggle();
  });
};

/**
 * Header component
 **/
components.header = function($element, options) {
  var self = this;
  var api = {};
  var defaults = {};
  var settings = $.extend({}, defaults, options);

  // deal with sticky menu bar
  var isSticky = false,
      stickyClass = 'header--sticky';

  var checkSticky = function() {
    var top = $(window).scrollTop();
    if(top > settings.offset && !isSticky) {
      $element
        .hide()
        .addClass(stickyClass)
        .slideDown(50);
      isSticky = true;
    } else if (top < settings.offset && isSticky){
      $element
        .slideUp(50, function(){
          $(this)
            .removeClass(stickyClass)
            .show();
        });
      isSticky = false;
    }
  };

  $(window).on("scroll load", checkSticky);

  return api;
};

components.elevator = function($element, options) {
  var self = this;
  var api = {};
  var defaults = {};
  var settings = $.extend({}, defaults, options);

  var isVisible = false,
      visibleClass = 'elevator--visible';

  var checkVisible = function() {
    var top = $(window).scrollTop();
    if(top > settings.offset && !isVisible) {
      $element.addClass(visibleClass);
      isVisible = true;
    } else if (top < settings.offset && isVisible){
      $element.removeClass(visibleClass);
      isVisible = false;
    }
  };

  $(window).on('scroll load', checkVisible);

  $element.on('click', function(){
    $('html, body').animate({ scrollTop: 0 }, 600);
    return false;
  });

  return api;
};


$(function() {
    bindJSControllers();
});
