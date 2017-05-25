declare namespace EventBusTS {
    class EventListener<TListener, TEvent extends EventBase> {
        scope: TListener;
        callback: (event: TEvent) => void;
        constructor(scope: TListener, callback: (event: TEvent) => void);
    }
    class EventBus {
        static listeners: {
            [key: string]: EventListener<any, EventBase>[];
        };
        static addEventListener<TDispatcher, TListenerScope, TEvent extends EventBase>(event: TEvent, callback: (event: TEvent) => void, scope: TListenerScope): void;
        static dispatch<TEvent extends EventBase>(event: TEvent): void;
    }
    abstract class EventBase {
        Dispatch(): void;
        readonly abstract Type: string;
    }
}
declare namespace EventBusTS {
    interface IHandlerConstructor<T> extends Function {
        __handlers__?: {
            [prop: string]: {
                Event: EventBase;
            };
        };
        new (...args: any[]): T;
    }
    function Handles(event: EventBase): MethodDecorator;
    function StateObserver<T>(target: IHandlerConstructor<T>): any;
}
