import { gql } from 'apollo-angular'

export const SURVEYS = {
    BROWSE: gql`
        query {
            quizzes {
                _id
                title
                description
                categories
                createdAt
            }
        }
    `,

    DESTROY: gql`
        mutation ($id: String!) {
            deleteQuiz(deleteQuizData: { id: $id }) {
                _id
            }
        }
    `,
    ADD: gql`
        mutation (
            $title: String!
            $description: String!
            $categories: [String!]!
            $questions: [CreateQuizQuestionInput!]!
        ) {
            createQuiz(
                createQuizData: {
                    title: $title
                    description: $description
                    categories: $categories
                    questions: $questions
                }
            ) {
                _id
            }
        }
    `,
    READ: gql`
        query ($id: String!) {
            quiz(id: $id) {
                _id
                title
                description
                categories
                questions {
                    question
                    type
                    answers
                    correctAnswers
                }
                createdAt
            }
        }
    `,
    CATEGORIES: gql`
        query {
            quizzes {
                categories
            }
        }
    `,
}
