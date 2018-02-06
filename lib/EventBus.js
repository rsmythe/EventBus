var EventBusTS;
(function (EventBusTS) {
    var EventHandler = (function () {
        function EventHandler(target, handler) {
            this.target = target;
            this.handler = handler;
        }
        return EventHandler;
    }());
    EventBusTS.EventHandler = EventHandler;
    var EventBus = (function () {
        function EventBus() {
        }
        EventBus.register = function (eventType, handler, target) {
            var eventTypeName = this.getEventName(eventType);
            var handlerRegistration = new EventHandler(target, handler);
            this.eventRegistry.hasOwnProperty(eventTypeName) ? this.eventRegistry[eventTypeName].push(handlerRegistration) : this.eventRegistry[eventTypeName] = [handlerRegistration];
        };
        EventBus.unregister = function (eventType, target) {
            var eventTypeName = this.getEventName(eventType);
            if (this.eventRegistry.hasOwnProperty(eventTypeName)) {
                var eventRegistration_1 = this.eventRegistry[eventTypeName];
                eventRegistration_1
                    .filter(function (l) { return l.target !== target; })
                    .forEach(function (listener, idx) {
                    eventRegistration_1.splice(eventRegistration_1.indexOf(listener), 1);
                });
            }
        };
        EventBus.dispatch = function (event) {
            var eventConstructor = event.constructor;
            var eventType = this.getEventName(eventConstructor);
            if (this.eventRegistry.hasOwnProperty(eventType)) {
                var listeners = this.eventRegistry[eventType];
                listeners.forEach(function (listener) {
                    if (listener && listener.handler) {
                        listener.handler.apply(listener.target, [event]);
                    }
                });
            }
        };
        EventBus.getEventName = function (eventType) {
            var result = /^function\s+([\w\$]+)\s*\(/.exec(eventType.toString());
            return result ? result[1] : '';
        };
        EventBus.eventRegistry = {};
        return EventBus;
    }());
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
            targetType.__handlers__[propertyKey] = event;
        };
        return f;
    }
    EventBusTS.Handles = Handles;
    function StateObserver(target) {
        var originalConstructor = target;
        var newConstructor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var constructedObject = new (originalConstructor.bind.apply(originalConstructor, [void 0].concat(args)))();
            if (originalConstructor.__handlers__) {
                for (var prop in originalConstructor.__handlers__) {
                    if (prop in constructedObject) {
                        var eventHandler = constructedObject[prop];
                        eventHandler.bind(constructedObject);
                        var eventType = originalConstructor.__handlers__[prop];
                        EventBusTS.EventBus.register(eventType, eventHandler, constructedObject);
                    }
                }
            }
            return constructedObject;
        };
        newConstructor.prototype = originalConstructor.prototype;
        return newConstructor;
    }
    EventBusTS.StateObserver = StateObserver;
})(EventBusTS || (EventBusTS = {}));
