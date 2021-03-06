import { Component } from '@angular/core'
import { MessageService } from 'primeng/api'
import { Log } from '../../../../shared/utils/log.tools'
import { RedirectService } from '../../../../shared/services/redirect.service'
import { presentLoading } from '../../../../shared/utils/observable.tools'
import { PuzzleService } from '../../../../shared/services/puzzle.service'
import { pages } from '../../../../shared/utils/pages.const'

@Component({
    selector: 'nx12-manage-single-puzzle',
    templateUrl: './manage-single-puzzle.page.html',
    styleUrls: ['./manage-single-puzzle.page.scss'],
})
export class ManageSinglePuzzlePage {
    pages = pages
    uploadedFiles: any[] = []
    constructor(
        private readonly messageService: MessageService,
        private readonly redirect: RedirectService,
        private readonly service: PuzzleService,
    ) {}

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file)
        }

        Log.debug('ManageSinglePuzzlePage::onUpload', 'uploadedFiles', this.uploadedFiles)

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' })
    }

    async save() {
        const loading = await presentLoading()
        try {
            const res = await this.service.add(this.uploadedFiles)
            Log.debug('ManageSinglePuzzlePage::save', 'res', res)
            this.redirect.back()
        } catch (e: any) {
            Log.error('ManageSinglePuzzlePage::save', e)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message })
        } finally {
            loading.dismiss().then()
        }
    }

    onSelect($event: any) {
        this.uploadedFiles = $event.currentFiles
    }
}
