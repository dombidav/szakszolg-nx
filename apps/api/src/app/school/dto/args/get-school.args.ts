import { IdArg } from '../../../../shared/gql-args/id.args'
import { ArgsType, Field } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@ArgsType()
export class GetSchoolArgs extends IdArg {
    @Field()
    @IsNotEmpty()
    id: string
}
