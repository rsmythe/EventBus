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
            var typeName = event.Type;
            var listener = new EventListener(scope, callback);
            this.listeners.hasOwnProperty(typeName) ? this.listeners[typeName].push(listener) : this.listeners[typeName] = [listener];
        };
        EventBus.dispatch = function (event) {
            var type = event.Type;
            if (this.listeners.hasOwnProperty(type)) {
                var listeners = this.listeners[type];
                listeners.forEach(function (listener) {
                    if (listener && listener.callback) {
                        listener.callback.apply(listener.scope, [event]);
                    }
                });
            }
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
                var _loop_1 = function (prop) {
                    if (original.__handlers__.hasOwnProperty(prop)) {
                        var event_1 = original.__handlers__[prop].Event;
                        var callback = function (evt) {
                            var fn = obj[prop].bind(obj);
                            fn(evt);
                        };
                        EventBusTS.EventBus.addEventListener(event_1, callback, obj);
                    }
                };
                for (var prop in original.__handlers__) {
                    _loop_1(prop);
                }
            }
            return obj;
        };
        f.prototype = original.prototype;
        return f;
    }
    EventBusTS.StateObserver = StateObserver;
})(EventBusTS || (EventBusTS = {}));
