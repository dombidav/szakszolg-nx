import { Injectable } from '@angular/core'
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Router } from '@angular/router'
import { from, lastValueFrom, Observable, of, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { RedirectService } from '../services/redirect.service'
import { StorageService } from '../services/storage.service'
import { STORAGE_KEY } from '../utils/constants'

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(
        private readonly storage: StorageService,
        private readonly router: Router,
        private readonly redirect: RedirectService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handle(next, req))
    }

    private handleError(err: HttpErrorResponse): Observable<any> {
        switch (err.status) {
            case 401:
                this.redirect.push(window.location.href)
                this.redirect.to('/login')
                break
            case 422:
            default:
                return throwError(() => err)
        }

        return of(err.message)
    }

    private async handle(next: HttpHandler, req: HttpRequest<any>) {
        let token: string | null = null
        if (!req.headers.get('X-AppMeta')?.split(',').includes('NO-AUTH')) {
            await this.storage.waitForStorage()
            token = (await this.storage.get<string>(STORAGE_KEY.ACCESS_TOKEN)) ?? null
        }
        if (!token?.startsWith('Bearer ')) {
            token = `Bearer ${token}`
        }
        const authReq = req.clone(token ? { headers: req.headers.set('Authorization', token) } : {})

        return lastValueFrom(next.handle(authReq).pipe(catchError((x) => this.handleError(x))))
    }
}
