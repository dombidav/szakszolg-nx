import { Field, Int, ObjectType } from '@nestjs/graphql'
import { IQuizAnswerOption, IQuizQuestion } from '@szakszolg-nx/api-interfaces'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Schema as MongooseSchema, Document } from 'mongoose'
import { QuizAnswerOption } from '../../quiz-answer-option/entities/quiz-answer-option.entity'

export type QuizQuestionDocument = IQuizQuestion & Document

@ObjectType()
@Schema()
export class QuizQuestion implements IQuizQuestion {
    @Field(() => Int)
    @Prop({ type: MongooseSchema.Types.Mixed })
    _id: any

    @Field()
    @Prop()
    question: string

    @Field()
    @Prop()
    type: string

    @Field(() => [QuizAnswerOption], { nullable: 'itemsAndList' })
    @Prop({ type: [MongooseSchema.Types.Mixed] })
    answers?: IQuizAnswerOption[]

    @Field(() => Int, { nullable: true })
    @Prop()
    categoryIndex?: number

    @Field()
    @Prop()
    createdAt: Date

    @Field()
    @Prop()
    updatedAt?: Date

    @Field({ nullable: true })
    @Prop()
    deletedAt?: Date
}

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion)
