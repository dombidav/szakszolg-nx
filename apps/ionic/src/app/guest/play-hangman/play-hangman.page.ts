/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {Component} from '@angular/core';
import {HangmanWordService} from "../../../shared/services/hangman-word.service";
import {AlertService} from "../../../shared/services/alert.service";
import {QueryRef} from "apollo-angular";
import {IHangmanWord} from "@szakszolg-nx/api-interfaces";
import {EmptyObject} from "apollo-angular/build/types";
import {Subscription} from "rxjs";

@Component({
    selector: 'nx12-play-hangman',
    templateUrl: './play-hangman.page.html',
    styleUrls: ['./play-hangman.page.scss'],
})
export class PlayHangmanPage {

    private queryRef?: QueryRef<{ hangmanWords: Partial<IHangmanWord>[] }, EmptyObject>
    private sub?: Subscription
    private queryRef2?: QueryRef<{ hangmanWord: Partial<IHangmanWord> }, EmptyObject>
    private sub2?: Subscription
    categories?: string[]
    selectedCategory: any
    word?: string;
    replaced?: string[]
    letters = ["a", "á", "b", "c", "d", "e", "é", "f", "g", "h", "i", "í", "j", "k", "l", "m", "n", "o", "ó", "ö",
        "ő", "p", "q", "r", "s", "t", "u", "ú", "ü", "ű", "v", "w", "x", "y", "z",]
    wordArray?: string[]
    counter = -1
    failed = false;
    success = false;
    selectedLetters: string[] = []
    previousWords: string[] = []
    noMoreWords = false
    rule = true;

    myScreenOrientation = window.screen.orientation;

    constructor(private readonly service: HangmanWordService, private readonly alert: AlertService) {
    }

    async init() {
        const loading = await this.alert.loading('MESSAGE.LOADING')
        this.queryRef = this.service.browseCategories()
        this.sub = this.queryRef.valueChanges
            .subscribe(
                (res) => {
                    const result = res.data.hangmanWords.map(x => x.category!) ?? []
                    this.categories = [...(new Set(result))]
                }
            )
        loading.dismiss().then()
    }

    ionViewDidEnter() {
        this.myScreenOrientation.lock("portrait");
        this.init().then()
    }

    ionViewDidLeave() {
        this.myScreenOrientation.unlock();
        this.sub?.unsubscribe()
        this.sub2?.unsubscribe()
    }

    showWord() {
        this.replaced = []
        this.queryRef2 = this.service.browseByCategory(this.selectedCategory)
        this.sub2 = this.queryRef2.valueChanges
            .subscribe((res) => {
                    this.word = res.data.hangmanWord.word ?? ''
                    this.replaced = this.word.replace(/[A-Za-zŐőÚúÖöÜüÓóŰűÁáÉéÍí]/g, '_').split('')
                }
            )
    }

    checkLetter(letter: string) {

        this.selectedLetters.push(letter)
        this.wordArray = this.word?.toLowerCase().split('')
        if (this.wordArray?.includes(letter)) {
            for (let i = 0; i < this.wordArray?.length; i++) {
                if (this.wordArray[i] === letter) {
                    this.replaced![i] = letter
                }
            }
        }
        else{
            this.counter++
            if(this.counter === 10){
                this.failed = true
            }
        }
        if (!this.replaced?.includes('_'))
            this.success = true

    }

    async nextWord() {
        let tries = 0

        this.counter = -1
        this.failed = false
        this.success = false
        this.selectedLetters = []
        const loading = await this.alert.loading('MESSAGE.LOADING')

        this.previousWords.push(this.word!)

        await this.queryRef2?.refetch()

        while (this.previousWords.includes(this.word!)){
            if (tries < 5){
                await this.queryRef2?.refetch()
                tries++
            }
            else
            {
                this.selectedCategory = false
                this.noMoreWords = true
                break
            }
        }
        loading.dismiss().then()
    }
}
