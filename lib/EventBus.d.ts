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
        static addEventListener<TEvent extends EventBase, TListenerScope>(event: IEventConstructor, callback: (event: TEvent) => void, scope: TListenerScope): void;
        static dispatch<TEvent extends EventBase>(event: TEvent): void;
        private static hash(str);
    }
    interface IEventConstructor {
        new (...args: any[]): EventBase;
    }
    abstract class EventBase {
        Dispatch(): void;
    }
}
declare namespace EventBusTS {
    interface IHandlerConstructor<T> extends Function {
        __handlers__?: {
            [prop: string]: {
                Event: IEventConstructor;
            };
        };
        new (...args: any[]): T;
    }
    function Handles(event: IEventConstructor): MethodDecorator;
    function StateObserver<T>(target: IHandlerConstructor<T>): any;
}
