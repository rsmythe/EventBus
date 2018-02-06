/* tslint:disable:no-unused-variable */
namespace EventBusTS
{
    // IHandlerConstructor
    // Represents the constructor for a type decorated with StateObserver
    //
    // T: The type of object returned by the constructor
    export interface IHandlerConstructor<T> extends Function
    {
        // A dictionary of [MethodName: { EventType }]
        __handlers__?: {
            [prop: string]: IEventConstructor
        };

        // Standard constructor
        new (...args: any[]): T;
    }


    export function Handles(event: IEventConstructor): MethodDecorator
    {
        let f: MethodDecorator = function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): any
        {
            const targetType: IHandlerConstructor<typeof target.constructor> = target.constructor;
            targetType.__handlers__ = targetType.__handlers__ || {};
            targetType.__handlers__[propertyKey] = event;
        };
        return f;
    }

    // Wraps a constructor with our event bus wireup logic
    export function StateObserver<T>(target: IHandlerConstructor<T>): any
    {
        let originalConstructor: IHandlerConstructor<T> = target;

        // Create a new function to replace the constructor
        let newConstructor: Function = function (...args: any[]): T
        {
            // Construct the object
            let constructedObject: T = new originalConstructor(...args);

            // Check if our custom property exists on the constructor
            if (originalConstructor.__handlers__)
            {
                // Loop through all decorated handler methods registered on this type
                for (let prop in originalConstructor.__handlers__)
                {
                    // Double-check that a method with that name exists on this object
                    if (prop in constructedObject)
                    {
                        // Get the event handler method from the constructed object
                        let eventHandler: (evt: EventBusTS.EventBase) => void = (<any>constructedObject)[prop];
                        eventHandler.bind(constructedObject);

                        // Event type to handle is stored in __handlers__[MethodName]
                        // ie: originalConstructor.__handlers__['OnDateChanged'] -> DateChangedEvent
                        let eventType: IEventConstructor = originalConstructor.__handlers__[prop];
 
                        // Register this object (constructedObject) to handle this event type (eventType) by calling this method (eventHandler)
                        EventBus.register(eventType, eventHandler, constructedObject);
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
}
/* tslint:enable:no-unused-variable */