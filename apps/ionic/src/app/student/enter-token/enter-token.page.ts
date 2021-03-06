import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {TokenService} from "../../../shared/services/token.service";
import {Subscription} from "rxjs";
import {QueryRef} from "apollo-angular";
import {IQuiz, IToken} from "@szakszolg-nx/api-interfaces";
import {EmptyObject} from "apollo-angular/build/types";
import {deepCopy} from "../../../shared/utils/object.tools";
import {RedirectService} from "../../../shared/services/redirect.service";
import {pages} from "../../../shared/utils/pages.const";
import {catchError} from "rxjs/operators";
import {MessageService} from "primeng/api";
import {StorageService} from "../../../shared/services/storage.service";
import {STORAGE_KEY} from "../../../shared/utils/constants";
import {Log} from "../../../shared/utils/log.tools";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'nx12-enter-token',
    templateUrl: './enter-token.page.html',
    styleUrls: ['./enter-token.page.scss'],
})
export class EnterTokenPage{
    token = ""
    private sub?: Subscription
    private queryRef?: QueryRef<{ token: Partial<IToken> }, EmptyObject>;

    constructor(protected readonly service: TokenService, private readonly redirect: RedirectService,
                private readonly toast: MessageService, private readonly storage: StorageService,
                private readonly translate: TranslatePipe) {
    }

    send() {
        this.queryRef = this.service.read(this.token)
        this.sub = this.queryRef?.valueChanges.pipe(
            catchError((err, caught) => {
                this.toast.add({summary: this.translate.transform(`TOKEN.EXPIRED`), severity: 'error'})
                throw "Expired token"
        })).subscribe((res) => {
            if(!res.data.token){
                this.toast.add({summary: this.translate.transform(`TOKEN.NOT_EXISTS`), severity: 'error'})
                return
            }

            this.storage.get(STORAGE_KEY.EDU_ID).then(edu_id => {
                if (edu_id) {
                    this.service.activeOM = edu_id
                }
            })

            this.service.activeQuiz = deepCopy(res.data.token.quiz as IQuiz)
            this.service.token = this.token
            this.storage.set(STORAGE_KEY.ACTIVE_QUIZ,this.service.activeQuiz).then()
            this.storage.set(STORAGE_KEY.SURVEY_TOKEN, this.token).then()
            this.storage.set(STORAGE_KEY.ACTIVE_QUIZ, this.service.activeQuiz).then()
            //this.storage.set(STORAGE_KEY.SURVEY_INDEX, 0).then(() => this.redirect.to(pages.student.surveyDetails))
            this.redirect.to(pages.student.surveyDetails)
        })
    }


    ionViewDidEnter() {
        this.storage.get(STORAGE_KEY.EDU_ID).then(om => {
            if(!om){
                this.redirect.to(pages.home)
            }
        })

        this.storage.get(STORAGE_KEY.SURVEY_TOKEN).then(token => {
            if(token){
                this.service.token = token
                this.token = token
                this.send()
            } else {
                this.service.index = 0
            }
        })
        this.storage.get(STORAGE_KEY.SURVEY_INDEX).then(index => {
            if (!index) {
                return;
            }
            this.service.index = index
        })
    }

    ionViewDidLeave() {
        this.sub?.unsubscribe()
        this.token = ''
    }
}
