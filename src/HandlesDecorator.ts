/* tslint:disable:no-unused-variable */
namespace EventBusTS
{
    export interface IHandlerConstructor<T> extends Function
    {
        __handlers__?: {
            [prop: string]: { Event: IEventConstructor }
        };
        new (...args: any[]): T;
    }

    export function Handles(event: IEventConstructor): MethodDecorator
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
        let originalConstructor: IHandlerConstructor<T> = target;

        //Create a new function to replace the constructor
        let newConstructor: Function = function (...args: any[]): T
        {
            //Construct the object
            let constructedObject: T = new originalConstructor(...args);

            if (originalConstructor.__handlers__)
            {
                for (let prop in originalConstructor.__handlers__)
                {
                    if (constructedObject[prop])
                    {
                        let eventHandler: (evt: EventBusTS.EventBase) => void = (<{ [prop: string]: (evt: EventBusTS.EventBase) => void }><any>constructedObject )[prop];
                        eventHandler.bind(constructedObject);

                        let event: IEventConstructor = originalConstructor.__handlers__[prop].Event;
 
                        EventBus.addEventListener(event, eventHandler, constructedObject);
                    }
                }
            }
            return constructedObject;
        };

        //Copy the original constructor's prototype onto our new function
        newConstructor.prototype = originalConstructor.prototype;

        //return the new function as the object constructor
        return newConstructor;
    }
    /* tslint:enable:no-unused-variable */
}