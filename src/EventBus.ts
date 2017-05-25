namespace EventBusTS
{
    export class EventListener<TListener, TEvent extends EventBase>
    {
        public constructor (public scope: TListener, public callback: (event: TEvent) => void)
        {

        }
    }

    export class EventBus
    {
        public static listeners: { [key: string]: EventListener<any, EventBase>[] } = {};

        public static addEventListener<TEvent extends EventBase, TListenerScope>(event: IEventConstructor, callback: (event: TEvent) => void, scope: TListenerScope): void
        {
            let typeHash: string = this.hash(event.toString());
            let listener: EventListener<TListenerScope, TEvent> = new EventListener(scope, callback);

            this.listeners.hasOwnProperty(typeHash) ? this.listeners[typeHash].push(listener) : this.listeners[typeHash] = [listener];
        }

        public static dispatch<TEvent extends EventBase>(event: TEvent): void
        {
            let typeHash: string = event.constructor.toString();
            if(this.listeners.hasOwnProperty(typeHash) )
            {
                let listeners: EventListener<any, TEvent>[] = this.listeners[typeHash];
                listeners.forEach((listener) =>
                {
                    if(listener && listener.callback) 
                    {
                        listener.callback.apply(listener.scope, [event]);
                    }
                });
            }
        }

        private static hash(str: string): string
        {
            let hash: number = 5381;
            let i: number = str.length;

            while(i) {
                hash = (hash * 33) ^ str.charCodeAt(--i);
            }

            /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
            * integers. Since we want the results to be always positive, convert the
            * signed int to an unsigned by doing an unsigned bitshift. */
            let hashed: number = hash >>> 0;

            return hashed.toString(16);
        }
    }

    export interface IEventConstructor
    {
        new (...args: any[]): EventBase;
    }

    export abstract class EventBase
    {
        public Dispatch(): void
        {
            EventBus.dispatch(this);
        }
    }
}