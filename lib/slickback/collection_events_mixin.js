(function() {
  "use strict";

  var linkGlobal = (typeof global  === 'undefined') ? this : global;
  var linkModule = (typeof exports === 'undefined') ? this : exports;

  var Slickback =
    linkModule.Slickback || linkGlobal.Slickback || require('../slickback'),
    use = Slickback.use;

  var imported = use(linkGlobal, [
      { symbol: '_', module: 'underscore' }
    ]),
    _ = imported._;

  var exportNamespace = Slickback;

  // Adapted from Slick.Grid v1.4.3 EventHelper
  function EventHandler() { this.handlers  = []; }
  _.extend(EventHandler.prototype, {
    subscribe: function(listener) { this.handlers.push(listener); },
    notify:    function(msg) {
      var handlerCount = this.handlers.length;
      for (var i = 0; i < handlerCount; i++) {
        this.handlers[i].call(this, msg);
      }
    }
  });

  var makeSubscriptionHandler = function(handlerName) {
    return function(subscriber) {
      if (_.isUndefined(this[handlerName])) {
        this[handlerName] = new EventHandler();
      }
      this[handlerName].subscribe(subscriber);
    };
  };

  var makeNotificationHandler = function(handlerName) {
    return function(msg) {
      if (! _.isUndefined(this[handlerName])) {
        this[handlerName].notify(msg);
      }
    };
  };

  var InstanceEventHandler = function(handlerName) {
    this.subscribe = makeSubscriptionHandler(handlerName);
    this.notify    = makeNotificationHandler(handlerName);
  };

  var installDataViewEventHandlers = function() {
    this.onRowCountChanged   =
      new InstanceEventHandler("onRowCountChanged");
    this.onRowsChanged       =
      new InstanceEventHandler("onRowsChanged");
    this.onPagingInfoChanged =
      new InstanceEventHandler("onPagingInfoChanged");
  };

  /**
   * Adapts a collection to be used as a Slick.Data.DataView
   * for purposes of event subscription and notification.
   * #installDataViewEventHandlers must be invoked on each instance.
   */
  exportNamespace.CollectionEventsMixin = {
    installDataViewEventHandlers: installDataViewEventHandlers
  };

}).call(this);
