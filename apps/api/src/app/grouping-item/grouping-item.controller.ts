import {
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { editFileName, imageFileFilter } from '../../utils/file.utils'
import { UPLOAD_PATH } from '../../utils/constants'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { unlink } from 'fs/promises'

@Controller('grouping-items')
export class GroupingItemController {
    @Post('')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FilesInterceptor('image', 20, {
            storage: diskStorage({
                destination: UPLOAD_PATH,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadMultipleFiles(@UploadedFiles() files: any[]) {
        const response = []
        files.forEach((file) => {
            const fileResponse = {
                originalName: file.originalname,
                filename: file.filename,
            }
            response.push(fileResponse)
        })

        return response
    }

    @Get(':path')
    seeUploadedFile(@Param('path') image, @Res() res) {
        return res.sendFile(image, { root: UPLOAD_PATH })
    }

    @Delete(':path')
    @UseGuards(JwtAuthGuard)
    async deleteFile(@Param('path') image) {
        try {
            Logger.log(`Deleting file ${image}`)
            await unlink(`${UPLOAD_PATH}/${image}`)
            return ''
        } catch (error) {
            console.log(error)
        }
    }
}
