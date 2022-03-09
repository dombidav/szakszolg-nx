import {Component, OnInit} from '@angular/core';
import {TokenService} from "../../../shared/services/token.service";
import {IQuizQuestion} from "@szakszolg-nx/api-interfaces";
import {RedirectService} from "../../../shared/services/redirect.service";
import {pages} from "../../../shared/utils/pages.const";
import {StorageService} from "../../../shared/services/storage.service";
import {STORAGE_KEY} from "../../../shared/utils/constants";

@Component({
    selector: 'nx12-fill-survey',
    templateUrl: './fill-survey.page.html',
    styleUrls: ['./fill-survey.page.scss'],
})
export class FillSurveyPage implements OnInit{



    constructor(public readonly service: TokenService, private readonly redirect: RedirectService,
                private readonly storage: StorageService) {
    }

    ionViewDidEnter() {
        this.onEnterInit().then()
    }

    private async onEnterInit() {
        await this.storage.get(STORAGE_KEY.SURVEY_QUESTIONS).then(questions => {
            if (!questions) {
                return;
            }
            this.service.questions = questions
        })

        await this.storage.get(STORAGE_KEY.SURVEY_INDEX).then(index => {
            if (!index) {
                return;
            }
            this.service.index = index
        })

        await this.storage.get(STORAGE_KEY.SURVEY_ANSWER).then(answer => {
            if (answer) {
                this.service.answers = answer
            }
        })

        console.log(this.service.activeQuiz?.template)
        console.log(this.service.index)

        if (this.service.activeQuiz?.template !== 'quiz' && this.service.index < 1) {

            this.service.questions = this.service.activeQuiz?.questions.sort((a, b) =>
                Math.random() - 0.5) ?? []
            this.storage.set(STORAGE_KEY.SURVEY_QUESTIONS, this.service.questions).then()
        }
        if (this.service.activeQuiz?.template === 'quiz'){
            this.service.questions = this.service.activeQuiz?.questions ?? []
            this.storage.set(STORAGE_KEY.SURVEY_QUESTIONS, this.service.questions).then()
        }

        console.log(this.service.activeQuiz)
    }

    log() {
        console.log(this.service.answers)
    }

    async next() {
        if (this.service.index >= this.service.questions.length - 1) {
            console.log('oh shit')
            return
        }
        if(!this.service.answers[this.service.index].answer) {
            console.log('fk')
            return
        }

        this.service.index++
        this.storage.set(STORAGE_KEY.SURVEY_INDEX, this.service.index).then()
        this.storage.set(STORAGE_KEY.SURVEY_ANSWER, this.service.answers).then()
    }

    async cancel() {
        delete this.service.token
        this.service.index = 0
        this.service.answers = this.service.answers.map(ans => ({
            ...ans,
            answer: ''
        }))
        await this.storage.remove(STORAGE_KEY.SURVEY_TOKEN).then()
        await this.storage.remove(STORAGE_KEY.SURVEY_INDEX).then()
        await this.storage.remove(STORAGE_KEY.SURVEY_ANSWER).then()
        this.redirect.to(pages.student.enterToken)
    }

    ngOnInit() {
        if(!this.service.activeQuiz)
            this.redirect.to(pages.student.enterToken)
    }

    back() {
        if (this.service.index <= 0) {
            return;
        }
        this.service.index--
        this.storage.set(STORAGE_KEY.SURVEY_INDEX, this.service.index).then()
    }
}
