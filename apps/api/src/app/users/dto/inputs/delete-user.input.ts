import { IdInput } from '../../../../shared/gql-inputs/id.input'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class DeleteUserInput extends IdInput {
    @Field()
    @IsNotEmpty()
    id: string
}
