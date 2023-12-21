import { Table } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import LoadingContext from '../utils/LoadingContext'

interface question {
    _id: string
    image: string
    answer: string
    difficulty: number
    rateCount: number
    avgAttempts: number
    rating: number
    creator: {
        fullName: string
        username: string
    }
}

const SelectedQuestions = () => {
    const { setLoading } = useContext(LoadingContext)

    const columns = [
        { title: 'No', dataIndex: 'no', width: 50 },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            width: 50,
            ellipsis: true
        },
        {
            title: 'Creator',
            dataIndex: ['creator', 'fullName']
        },
        { title: 'Answer', dataIndex: 'answer' },
        {
            title: 'Image',
            dataIndex: 'image',
            // width: 50,
            ellipsis: true,
            render: (image: string) => {
                return <img src={image} alt="Question" />
            }
        }
    ]
    const loadQuestions = useCallback(async () => {
        setLoading(true)

        const allQuestionsRes = await fetchData({
            path: `/question/?showImage=true`
        })
        const selected = await fetchData({
            path: `/contest`
        })
        setLoading(false)
        const allQuestions = allQuestionsRes['questions']
        const selectedQuestionIds = selected['contest']['questionOrder']
        const selectedQuestions = selectedQuestionIds.map((id: string) =>
            allQuestions.find((q: question) => q._id === id)
        )
        setLoading(false)
        setQuestions(selectedQuestions)
    }, [setLoading])
    const [questions, setQuestions] = useState<question[]>()
    useEffect(() => {
        loadQuestions()
    }, [loadQuestions])
    return (
        <div>
            <Table
                className="max-w-full"
                size="small"
                columns={columns}
                dataSource={questions?.map((val, index) => {
                    return { ...val, key: val._id, no: index + 1 }
                })}
                bordered={true}
                pagination={false}
            />
        </div>
    )
}
export default SelectedQuestions
