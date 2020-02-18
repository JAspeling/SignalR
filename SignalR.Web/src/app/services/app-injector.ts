import { Injector, Type } from '@angular/core';
import { isNullOrUndefined } from 'util';

export class AppInjector {

    private static injector: Injector;

    static setInjector(injector: Injector): void {
        AppInjector.injector = injector;
    }

    static getInjector(): Injector {
        if (isNullOrUndefined(AppInjector.injector)) {
            throw new Error(`Failed to retrieve an instance of the AppInjector. If using the Injector in Karma, you have to call AppInjector.setInjector(TestBed.get(Injector)) ` +
                `when initializing the test.`);
        }
        return AppInjector.injector;
    }

    static getInstance<T>(instance: unknown): T {
        const result: T = this.getInjector().get<T>(instance as Type<T>);
        if (isNullOrUndefined(result)) {
            const constructorName: string = `${instance.constructor.name}`;
            const classInformationName: string = instance['classInformation'] ? instance['classInformation'].name : undefined;

            throw new Error(`Failed to retrieve an instance of ${classInformationName ? classInformationName : constructorName} from the AppInjector.`);
        }
        return result;
    }
}
