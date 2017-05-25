var EventBusTS;
(function (EventBusTS) {
    class EventListener {
        constructor(scope, callback) {
            this.scope = scope;
            this.callback = callback;
        }
    }
    EventBusTS.EventListener = EventListener;
    class EventBus {
        static addEventListener(type, callback, scope) {
            type.prototype.toString();
            let typeName = type.name;
            let listener = new EventListener(scope, callback);
            this.listeners.hasOwnProperty(typeName) ? this.listeners[typeName].push(listener) : this.listeners[typeName] = [listener];
        }
        static dispatch(event) {
            let type = event.constructor.name;
            if (this.listeners.hasOwnProperty(type)) {
                let listeners = this.listeners[type];
                listeners.forEach((listener) => {
                    if (listener && listener.callback) {
                        listener.callback.apply(listener.scope, [event]);
                    }
                });
            }
        }
    }
    EventBus.listeners = {};
    EventBusTS.EventBus = EventBus;
    class EventBase {
        Dispatch() {
            EventBus.dispatch(this);
        }
    }
    EventBusTS.EventBase = EventBase;
})(EventBusTS || (EventBusTS = {}));
var EventBusTS;
(function (EventBusTS) {
    function Handles(event) {
        let f = function (target, propertyKey, descriptor) {
            const targetType = target.constructor;
            targetType.__handlers__ = targetType.__handlers__ || {};
            targetType.__handlers__[propertyKey] = { Event: event };
        };
        return f;
    }
    EventBusTS.Handles = Handles;
    function StateObserver(target) {
        let original = target;
        let f = function (...args) {
            let obj = new original(...args);
            if (original.hasOwnProperty('__handlers__')) {
                for (let prop in original.__handlers__) {
                    if (original.__handlers__.hasOwnProperty(prop)) {
                        let event = original.__handlers__[prop].Event;
                        let callback = (evt) => {
                            let fn = obj[prop].bind(obj);
                            fn(evt);
                        };
                        EventBusTS.EventBus.addEventListener(event, callback, obj);
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
