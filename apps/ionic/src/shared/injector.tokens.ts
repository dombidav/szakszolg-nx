import { InjectionToken } from '@angular/core'
import { IStorageService } from '@szakszolg-nx/ng-interfaces'

export const STORAGE_SERVICE = new InjectionToken<IStorageService>('StorageService')
export const APOLLO_CLIENT = new InjectionToken<object>('ApolloClient')
