var EventBusTS;
(function (EventBusTS) {
    var EventListener = (function () {
        function EventListener(scope, callback) {
            this.scope = scope;
            this.callback = callback;
        }
        return EventListener;
    }());
    EventBusTS.EventListener = EventListener;
    var EventBus = (function () {
        function EventBus() {
        }
        EventBus.addEventListener = function (event, callback, scope) {
            var typeHash = this.hash(event.toString());
            var listener = new EventListener(scope, callback);
            this.listeners.hasOwnProperty(typeHash) ? this.listeners[typeHash].push(listener) : this.listeners[typeHash] = [listener];
        };
        EventBus.dispatch = function (event) {
            var typeHash = this.hash(event.constructor.toString());
            if (this.listeners.hasOwnProperty(typeHash)) {
                var listeners = this.listeners[typeHash];
                listeners.forEach(function (listener) {
                    if (listener && listener.callback) {
                        listener.callback.apply(listener.scope, [event]);
                    }
                });
            }
        };
        EventBus.hash = function (str) {
            var hash = 5381;
            var i = str.length;
            while (i) {
                hash = (hash * 33) ^ str.charCodeAt(--i);
            }
            var hashed = hash >>> 0;
            return hashed.toString(16);
        };
        return EventBus;
    }());
    EventBus.listeners = {};
    EventBusTS.EventBus = EventBus;
    var EventBase = (function () {
        function EventBase() {
        }
        EventBase.prototype.Dispatch = function () {
            EventBus.dispatch(this);
        };
        return EventBase;
    }());
    EventBusTS.EventBase = EventBase;
})(EventBusTS || (EventBusTS = {}));
var EventBusTS;
(function (EventBusTS) {
    function Handles(event) {
        var f = function (target, propertyKey, descriptor) {
            var targetType = target.constructor;
            targetType.__handlers__ = targetType.__handlers__ || {};
            targetType.__handlers__[propertyKey] = { Event: event };
        };
        return f;
    }
    EventBusTS.Handles = Handles;
    function StateObserver(target) {
        var original = target;
        var f = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var obj = new (original.bind.apply(original, [void 0].concat(args)))();
            if (original.hasOwnProperty('__handlers__')) {
                for (var prop in original.__handlers__) {
                    if (original.__handlers__.hasOwnProperty(prop)) {
                        var eventHandler = obj[prop];
                        eventHandler.bind(obj);
                        var event_1 = original.__handlers__[prop].Event;
                        EventBusTS.EventBus.addEventListener(event_1, eventHandler, obj);
                    }
                }
            }
            return obj;
        };
        f.prototype = original.prototype;
        return f;
    }
    EventBusTS.StateObserver = StateObserver;
})(EventBusTS || (EventBusTS = {}));
