import { IdInput } from '../../../../shared/gql-inputs/id.input'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IUpdatedAt } from '@szakszolg-nx/api-interfaces'

@InputType()
export class UpdatePuzzleInput extends IdInput implements IUpdatedAt {
    @Field()
    @IsNotEmpty()
    id: string

    updatedAt?: Date
}
