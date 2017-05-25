/* tslint:disable:no-unused-variable */
namespace EventBusTS
{
    export interface IHandlerConstructor<T> extends Function
    {
        __handlers__?: {
            [prop: string]: { Event: new(...args: any[]) =>  EventBase }
        };
        new (...args: any[]): T;
    }

    export function Handles(event: new(...args: any[]) =>  EventBase): MethodDecorator
    {
        let f: MethodDecorator = function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any
        {
            const targetType: IHandlerConstructor<typeof target.constructor> = target.constructor;
            targetType.__handlers__ = targetType.__handlers__ || {};
            targetType.__handlers__[propertyKey] = { Event: event };
        };
        return f;
    }

    export function StateObserver<T>(target: IHandlerConstructor<T>): any
    {
        let original: IHandlerConstructor<T> = target;

        //Create a new function to replace the constructor
        let f: Function = function (...args: any[]): T
        {
            //Construct the object
            let obj: T = new original(...args);

            if (original.hasOwnProperty('__handlers__'))
            {
                for (let prop in original.__handlers__)
                {
                    if (original.__handlers__.hasOwnProperty(prop))
                    {
                        let event: new(...args: any[]) =>  EventBase = original.__handlers__[prop].Event;
                        let callback: (evt: EventBusTS.EventBase) => void = (evt: EventBusTS.EventBase) => 
                            {
                                let fn: (evt: EventBusTS.EventBase) => void = obj[prop].bind(obj);
                                fn(evt);
                            };
                        EventBus.addEventListener(event, callback, obj);
                    }
                }
            }
            return obj;
        };

        //Copy the original constructor's prototype onto our new function
        f.prototype = original.prototype;

        //return the new function as the object constructor
        return f;
    }
    /* tslint:enable:no-unused-variable */
}