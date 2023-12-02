import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
    Droppable,
    Draggable,
    DropResult,
    DragDropContext
} from '@hello-pangea/dnd'
import { fetchData } from '../utils/fetch'
import { Button, Layout, List, Rate, Typography, message } from 'antd'
import { Link } from 'react-router-dom'
import LoadingContext from '../utils/LoadingContext'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
const { Text, Paragraph } = Typography
enum QuestionCategory {
    Other = 'Other',
    Technical = 'Technical',
    Movie = 'Movie',
    Music = 'Music',
    Celebrity = 'Celebrity',
    Sports = 'Sports',
    Place = 'Place',
    Brand = 'Brand',
    Food = 'Food'
}
interface Question {
    _id: string
    image: string
    answer: string
    difficulty: number
    category: QuestionCategory
    rateCount: number
    avgAttempts: number
    rating: number
    creator: {
        fullName: string
        username: string
    }
}
const shuffle = (array: Array<Question>): Array<Question> => {
    const shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i]
        ]
    }
    return shuffledArray
}
const sortByKey = (
    arr: Array<Question>,
    key: 'difficulty' | 'answer',
    reverse: boolean = false
): Array<Question> => {
    // Create a copy of the original array to avoid modifying the original array
    const sortedArray = [...arr]

    sortedArray.sort((a, b) => {
        let comparison = 0

        if (a[key] < b[key]) {
            comparison = -1
        } else if (a[key] > b[key]) {
            comparison = 1
        }

        return reverse ? comparison * -1 : comparison
    })

    return sortedArray
}
interface ArrangeQuestionsProps {
    showImage: boolean
}

const ArrangeQuestions: React.FC<ArrangeQuestionsProps> = ({ showImage }) => {
    const { setLoading } = useContext(LoadingContext)
    const [contest_id, setContest_id] = useState<string>()
    const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
    const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([])
    const [originalSelectedQuestions, setOriginalSelectedQuestions] = useState<
        Question[]
    >([])
    const [originalRemainingQuestions, setOriginalRemainingQuestions] =
        useState<Question[]>([])
    const fetchDataFromAPI = useCallback(async () => {
        try {
            setLoading(true)
            const allQuestionsRes = await fetchData({
                path: `/question/?showImage=${showImage}`
            })
            const selected = await fetchData({
                path: `/contest/?showImage=${showImage}`
            })
            setLoading(false)
            const allQuestions = allQuestionsRes['questions']
            setContest_id(selected['contest']['_id'])
            const selectedQuestionIds = selected['contest']['questionOrder']
            const remaining = allQuestions.filter(
                (question: Question) =>
                    !selectedQuestionIds.includes(question._id)
            )
            const selectedQuestions = selectedQuestionIds.map((id: string) =>
                allQuestions.find((q: Question) => q._id === id)
            )
            setOriginalRemainingQuestions(remaining)
            setOriginalSelectedQuestions(selectedQuestions)
            setSelectedQuestions(selectedQuestions)
            setRemainingQuestions(remaining)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [setLoading, showImage])
    useEffect(() => {
        fetchDataFromAPI()
    }, [fetchDataFromAPI, setLoading])

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result
        if (
            !destination ||
            (destination.droppableId === source.droppableId &&
                destination.index === source.index)
        ) {
            return
        }
        const isReorderInSelected = source.droppableId === 'Selected'
        const sourceList = isReorderInSelected
            ? selectedQuestions
            : remainingQuestions
        const destList = isReorderInSelected
            ? remainingQuestions
            : selectedQuestions
        const setSourceList = isReorderInSelected
            ? setSelectedQuestions
            : setRemainingQuestions
        const setDestList = isReorderInSelected
            ? setRemainingQuestions
            : setSelectedQuestions

        function moveElementBetweenLists(
            listA: Question[],
            listB: Question[],
            i: number,
            j: number
        ) {
            const element = listA[i]
            listA.splice(i, 1)
            listB.splice(j, 0, element)

            return { newListA: listA, newListB: listB }
        }

        function moveElement(arr: Question[], i: number, j: number) {
            const element = arr.splice(i, 1)[0]
            arr.splice(j, 0, element)
            return arr
        }
        if (destination.droppableId === source.droppableId) {
            const newArr = moveElement(
                sourceList,
                source.index,
                destination.index
            )
            setSourceList(newArr)
        } else {
            const { newListA, newListB } = moveElementBetweenLists(
                sourceList,
                destList,
                source.index,
                destination.index
            )
            setSourceList(newListA)
            setDestList(newListB)
        }
    }

    const saveSelectedQuestions = async () => {
        const selectedIds = selectedQuestions.map((question) => question._id)
        setLoading(true)
        const data = await fetchData({
            path: `/contest/update/${contest_id}`,
            method: 'PUT',
            body: { questionOrder: selectedIds }
        })
        setLoading(false)
        if (data.success) {
            message.success(data.message)
        } else {
            message.error(data.message)
        }
    }

    const deleteQuestion = async (id: string) => {
        setLoading(true)
        const data = await fetchData({
            path: `/question/${id}`,
            method: 'DELETE'
        })
        setLoading(false)
        if (data.success) {
            message.success(data.message)
            fetchDataFromAPI()
        } else {
            message.error(data.message)
            navigator.vibrate(200)
        }
    }
    return (
        <div>
            <Button
                className="block my-2 mx-auto"
                onClick={() => {
                    setSelectedQuestions(originalSelectedQuestions)
                    setRemainingQuestions(originalRemainingQuestions)
                }}
            >
                Reset to Default
            </Button>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="lg:flex">
                    <div className="flex-1 lg:px-4 py-2 bg-green-50 min-h-[250px] lg:m-5 rounded-lg shadow-md">
                        <div className="flex flex-col space-y-4">
                            <Button
                                onClick={() => {
                                    setSelectedQuestions((prev) =>
                                        shuffle(prev)
                                    )
                                }}
                            >
                                Randomize Selected
                            </Button>
                            <Button
                                onClick={() => {
                                    setSelectedQuestions((prev) =>
                                        sortByKey(prev, 'difficulty', false)
                                    )
                                }}
                            >
                                Sort By Difficulty low to high
                            </Button>
                            <Button
                                onClick={() => {
                                    setSelectedQuestions((prev) =>
                                        sortByKey(prev, 'difficulty', true)
                                    )
                                }}
                            >
                                Sort By Difficulty high to low
                            </Button>
                            <Button
                                onClick={() => {
                                    setRemainingQuestions((prev) => [
                                        ...selectedQuestions,
                                        ...prev
                                    ])
                                    setSelectedQuestions([])
                                }}
                            >
                                Clear All Question
                            </Button>
                        </div>
                        <DropList
                            questions={selectedQuestions}
                            showTitle={true}
                            name="Selected"
                            onDelete={deleteQuestion}
                        />
                    </div>
                    <div className="flex-1 lg:px-4 py-2 bg-red-50 min-h-[250px] lg:m-5 rounded-lg shadow-md">
                        <div className="flex flex-col space-y-4">
                            <Button
                                onClick={() => {
                                    setRemainingQuestions((prev) =>
                                        sortByKey(prev, 'difficulty', false)
                                    )
                                }}
                            >
                                Sort By Difficulty low to high
                            </Button>
                            <Button
                                onClick={() => {
                                    setRemainingQuestions((prev) =>
                                        sortByKey(prev, 'difficulty', true)
                                    )
                                }}
                            >
                                Sort By Difficulty high to low
                            </Button>
                            <Button
                                onClick={() => {
                                    setSelectedQuestions((prev) => [
                                        ...prev,
                                        ...remainingQuestions
                                    ])
                                    setRemainingQuestions([])
                                }}
                            >
                                Select all in same order
                            </Button>
                            <Button
                                onClick={() => {
                                    setSelectedQuestions((prev) =>
                                        shuffle([
                                            ...prev,
                                            ...remainingQuestions
                                        ])
                                    )
                                    setRemainingQuestions([])
                                }}
                            >
                                Select all in with random
                            </Button>
                        </div>
                        <DropList
                            questions={remainingQuestions}
                            name="Remaining"
                            showTitle={false}
                            onDelete={deleteQuestion}
                        />
                    </div>
                </div>
            </DragDropContext>
            <div className="flex items-center justify-center p-5">
                <Button onClick={saveSelectedQuestions}>Save</Button>
            </div>
        </div>
    )
}

const DropList = ({
    questions,
    name,
    showTitle,
    onDelete
}: {
    questions: Question[]
    name: string
    showTitle: boolean
    onDelete: (id: string) => void
}) => {
    return (
        <Droppable droppableId={name}>
            {(provided) => (
                <Layout
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="h-full bg-inherit"
                >
                    <Paragraph className="text-xl py-4 font-bold">
                        {name} Questions ({questions.length})
                    </Paragraph>
                    {questions.length === 0 && (
                        <Paragraph className="text-lg text-center">
                            No Questions {name}
                        </Paragraph>
                    )}
                    <List
                        dataSource={questions}
                        renderItem={(question: Question, index: number) => (
                            <Draggable
                                key={question._id}
                                draggableId={question._id.toString()}
                                index={index}
                            >
                                {(provided) => (
                                    <List.Item
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="flex flex-col m-2 shadow-md light:bg-zinc-50 rounded-lg"
                                    >
                                        <div>
                                            {showTitle && (
                                                <Text>
                                                    Question {index + 1}
                                                </Text>
                                            )}
                                        </div>
                                        <div className="h-60 flex w-full p-2">
                                            <img
                                                alt={`Question ${index + 1}`}
                                                className="h-full max-w-[50%] object-contain"
                                                src={question.image}
                                            />
                                            <div className="flex justify-evenly flex-col ml-5">
                                                <p className="text-md lg:text-lg">
                                                    {question.answer}
                                                </p>
                                                <p className="text-sm">
                                                    ({question.category})
                                                </p>
                                                <div>
                                                    <Rate
                                                        disabled
                                                        value={
                                                            question.difficulty
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    {question.creator.fullName}{' '}
                                                    ({question.creator.username}
                                                    )
                                                </div>
                                                <div>
                                                    <Paragraph>Game</Paragraph>
                                                    <Paragraph>
                                                        Attempts:{' '}
                                                        {question.avgAttempts.toFixed(
                                                            1
                                                        )}
                                                    </Paragraph>
                                                    <Paragraph>
                                                        Completed by:{' '}
                                                        {question.rateCount}
                                                    </Paragraph>
                                                    <Rate
                                                        disabled
                                                        value={question.rating}
                                                    />
                                                </div>
                                                <div className="flex justify-center space-x-2">
                                                    <Link
                                                        to={`/editquestionadmin/${question._id}`}
                                                    >
                                                        <Button>
                                                            <EditOutlined />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        onClick={() => {
                                                            onDelete(
                                                                question._id
                                                            )
                                                        }}
                                                    >
                                                        <DeleteOutlined className="text-red-400" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            </Draggable>
                        )}
                    >
                        {provided.placeholder}
                    </List>
                </Layout>
            )}
        </Droppable>
    )
}

export default ArrangeQuestions
