import { Field, InputType } from '@nestjs/graphql'
import { GqlInput } from '../../../../shared/gql-inputs/gql-input.abstract'

@InputType()
export class CreateGroupingItemInput extends GqlInput {
    @Field()
    item: string

    @Field(() => [String])
    groups: string[]

    @Field()
    correct: string
}
