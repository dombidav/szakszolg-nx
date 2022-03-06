/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IQuiz, IQuizQuestion } from '@szakszolg-nx/api-interfaces'
import { QueryRef } from 'apollo-angular'
import { NG_ICON } from '../../../../shared/utils/prime-icons.class'
import { first, Subscription } from 'rxjs'
import { ConfirmationService, MessageService } from 'primeng/api'
import { TranslatePipe } from '@ngx-translate/core'
import { NavController } from '@ionic/angular'
import { deepCopy, omit } from '@szakszolg-nx/shared-module'
import { SurveyService } from '../../../../shared/services/survey.service'

@Component({
    selector: 'nx12-manage-single-survey',
    templateUrl: './manage-single-survey.page.html',
    styleUrls: ['./manage-single-survey.page.scss'],
})
export class ManageSingleSurveyPage {
    survey?: Partial<IQuiz>
    originalSurvey?: Partial<IQuiz>
    NG_ICON = NG_ICON
    validationErrors: { [key: string]: string } = {}
    filteredCategories: string[] = []
    questionEditing?: Partial<IQuizQuestion>
    private originalQuestionEditing?: Partial<IQuizQuestion>
    private categories: string[] = []
    private queryRef?: QueryRef<{ quiz: Partial<IQuiz> }>
    private sub = new Subscription()
    private categoriesQueryRef?: QueryRef<{ quizzes: { categories: string[] }[] }>

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly surveyService: SurveyService,
        private readonly confirmation: ConfirmationService,
        private readonly translate: TranslatePipe,
        private readonly nav: NavController,
        private readonly toast: MessageService,
    ) {}

    ionViewDidEnter() {
        this.init().then()
    }

    check(prop: keyof IQuiz) {
        const validation = validations[prop](this.survey![prop as keyof IQuiz], prop)
        setTimeout(() => {
            if (!validation) this.validationErrors[prop] = this.translate.transform(`USER_EDIT.ERROR.${prop}`)
            // TODO: translate and show on UI
            else this.validationErrors[prop] = ''
        }, 50)
        return !validation
    }

    ionViewDidLeave() {
        this.sub?.unsubscribe()
    }

    save() {
        if (this.survey?._id) {
            this.update()
            return
        }
        this.create()
    }

    search($event: any) {
        this.filteredCategories =
            this.categories?.filter((category) => category.includes($event.query.toLowerCase())) ?? []
    }

    addClick() {
        const newQuestion = {
            _id: this.survey?.questions?.length.toString() ?? '0',
            type: '',
            createdAt: new Date(),
            question: '',
            answers: [],
            correctAnswers: [],
        }
        if (!this.survey?.questions) this.survey!.questions = []
        this.survey?.questions?.push(newQuestion)
        this.questionEditing = newQuestion
        this.originalQuestionEditing = deepCopy(newQuestion)
    }

    editClick(item: Omit<IQuizQuestion, '_id'>) {
        this.questionEditing = item
        this.originalQuestionEditing = deepCopy(item)
    }

    deleteClick(item: Omit<IQuizQuestion, '_id'>) {
        this.survey!.questions = this.survey!.questions?.filter((question) => question.question !== item.question) // TODO: Add confirmation
    }

    formCanceled() {
        this.questionEditing = Object.assign(this.questionEditing!, this.originalQuestionEditing!)

        if (this.questionEditing?._id) {
            this.survey?.questions?.slice(
                this.survey?.questions?.findIndex((question) => question._id === this.questionEditing?._id),
                1,
            )
        }

        delete this.originalQuestionEditing
        delete this.questionEditing
    }

    formSubmitted($event: Partial<IQuizQuestion>) {
        delete this.questionEditing
        delete this.originalQuestionEditing
    }

    private async init() {
        this.getCategories().then()
        this.sub.add(
            this.activatedRoute.params.subscribe(async (params) => {
                if (params.id === 'new') {
                    this.survey = {
                        title: '',
                        description: '',
                        questions: [],
                        categories: [''],
                    }
                    return
                }

                this.queryRef = this.surveyService.read(params.id)
                this.sub.add(
                    this.queryRef!.valueChanges.subscribe(({ data }) => {
                        this.survey = deepCopy(data.quiz)
                        if (this.survey.categories?.length === 0) this.survey.categories = ['']
                        this.originalSurvey = deepCopy(this.survey)
                    }),
                )
                this.queryRef?.refetch().then()
            }),
        )
    }

    private create() {
        this.surveyService
            .add(this.survey!)
            .pipe(first())
            .subscribe(() => this.saveCallback())
    }

    private update() {
        this.surveyService
            .edit(this.survey!._id, omit(this.survey!, '_id'))
            .pipe(first())
            .subscribe(() => this.saveCallback())
    }

    private saveCallback() {
        this.originalSurvey = { ...this.survey }
        this.toast.add({
            severity: 'success',
            summary: this.translate.transform('FORM_OPERATION.SUCCESS'),
            detail: this.translate.transform('FORM_OPERATION.SUCCESS_DETAIL'),
        })
        this.nav.back()
    }

    private async getCategories() {
        if (this.categoriesQueryRef) {
            this.categoriesQueryRef.refetch().then()
            return
        }

        this.categoriesQueryRef = this.surveyService.getCategories()
        this.sub.add(
            this.categoriesQueryRef.valueChanges.subscribe((res) => {
                this.categories = []
                const set = new Set<string>()
                res.data.quizzes.forEach((quiz) => quiz.categories.forEach((category) => set.add(category)))
                this.categories = Array.from(set)
                this.filteredCategories = [...this.categories]
            }),
        )
    }
}

const validations: { [key: string]: (value: string, attribute: string) => boolean } = {}