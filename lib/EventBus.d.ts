declare namespace EventBusTS {
    class EventHandler<TTarget, TEvent extends EventBase> {
        target: TTarget;
        handler: (event: TEvent) => void;
        constructor(target: TTarget, handler: (event: TEvent) => void);
    }
    class EventBus {
        private static eventRegistry;
        static register<TEvent extends EventBase, TTarget>(eventType: IEventConstructor, handler: (evt: TEvent) => void, target: TTarget): void;
        static unregister<TTarget>(eventType: IEventConstructor, target: TTarget): void;
        static dispatch<TEvent extends EventBase>(event: TEvent): void;
        private static getEventName(eventType);
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
            [prop: string]: IEventConstructor;
        };
        new (...args: any[]): T;
    }
    function Handles(event: IEventConstructor): MethodDecorator;
    function StateObserver<T>(target: IHandlerConstructor<T>): any;
}
