import React, { useState, useEffect, useContext } from 'react'
import {
    Droppable,
    Draggable,
    DropResult,
    DragDropContext
} from '@hello-pangea/dnd'
import { fetchData } from '../utils/fetch'
import { Button, List, Rate, message } from 'antd'
import { Link } from 'react-router-dom'
import LoadingContext from '../utils/LoadingContext'

interface Question {
    _id: string
    image: string
    answer: string
    difficulty: number
}

const ArrangeQuestions: React.FC = () => {
    const { setLoading } = useContext(LoadingContext)

    const [contest_id, setContest_id] = useState<string>()
    const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
    const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([])

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                setLoading(true)
                const allQuestionsRes = await fetchData({ path: '/question/' })
                const selected = await fetchData({ path: '/contest/' })
                setLoading(false)
                const allQuestions = allQuestionsRes['questions']
                setContest_id(selected['contest']['_id'])
                const selectedQuestionIds = selected['contest']['questionOrder']
                const remaining = allQuestions.filter(
                    (question: Question) =>
                        !selectedQuestionIds.includes(question._id)
                )

                setSelectedQuestions(
                    selectedQuestionIds.map((id: string) =>
                        allQuestions.find((q: Question) => q._id === id)
                    )
                )
                setRemainingQuestions(remaining)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchDataFromAPI()
    }, [setLoading])

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result
        console.log({ destination, source })
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
    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="lg:flex">
                    <div className="flex-1 px-4 py-2 bg-green-50 min-h-[250px] m-5 rounded-lg shadow-md">
                        <DropList
                            questions={selectedQuestions}
                            showTitle={true}
                            name="Selected"
                        />
                    </div>
                    <div className="flex-1 px-4 py-2 bg-red-50 min-h-[250px] m-5 rounded-lg shadow-md">
                        <DropList
                            questions={remainingQuestions}
                            name="Remaining"
                            showTitle={false}
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
    showTitle
}: {
    questions: Question[]
    name: string
    showTitle: boolean
}) => {
    return (
        <Droppable droppableId={name}>
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    <div className="text-xl py-4 font-bold">
                        {name} Questions ({questions.length})
                    </div>
                    {questions.length === 0 && (
                        <div className="text-lg text-center">
                            No Questions {name}
                        </div>
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
                                        className="flex flex-col m-2 shadow-md bg-zinc-50 rounded-lg"
                                    >
                                        <div>
                                            {showTitle && (
                                                <div>Question {index + 1}</div>
                                            )}
                                        </div>
                                        <div className="h-40 flex w-full p-2">
                                            <img
                                                alt={`Question ${index + 1}`}
                                                className="h-full max-w-[50%] object-contain"
                                                src={question.image}
                                            />
                                            <div className="flex justify-evenly flex-col ml-5">
                                                <p className="text-lg">
                                                    {question.answer}
                                                </p>
                                                <div>
                                                    <Rate
                                                        disabled
                                                        value={
                                                            question.difficulty
                                                        }
                                                    />
                                                </div>
                                                <Link
                                                    to={`/addquestion/${question._id}`}
                                                >
                                                    <Button>Edit</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            </Draggable>
                        )}
                    >
                        {provided.placeholder}
                    </List>
                </div>
            )}
        </Droppable>
    )
}

export default ArrangeQuestions
