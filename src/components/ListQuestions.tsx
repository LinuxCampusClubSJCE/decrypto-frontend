import { Table, message } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import LoadingContext from '../utils/LoadingContext'

interface question {
    _id: string
    image: string
    answer: string
    hint: string
    difficulty: number
}

const ListQuestions = () => {
    const { setLoading } = useContext(LoadingContext)
    const navigate = useNavigate()
    const deleteQuestion = async (id: string) => {
        setLoading(true)
        const data = await fetchData({
            path: `/question/${id}`,
            method: 'DELETE'
        })
        setLoading(false)
        loadQuestions()
        if (data.success) {
            message.success(data.message)
        } else {
            message.error(data.message)
            navigator.vibrate(200)
        }
    }
    const columns = [
        { title: 'Answer', dataIndex: 'answer' },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            width: 50,
            ellipsis: true
        },
        {
            title: 'Image',
            dataIndex: 'image',
            // width: 50,
            ellipsis: true,
            render: (image: string) => {
                return <img src={image} alt="Question" />
            }
        },
        {
            title: 'Edit',
            dataIndex: '_id',
            width: 60,
            ellipsis: true,
            render: (_id: string) => {
                return (
                    <button onClick={() => navigate(`/addquestion/${_id}`)}>
                        <EditOutlined />
                    </button>
                )
            }
        },
        {
            title: 'Delete',
            dataIndex: '_id',
            width: 60,
            ellipsis: true,
            render: (_id: string) => {
                return (
                    <button onClick={() => deleteQuestion(_id)}>
                        <DeleteOutlined className="text-red-600" />
                    </button>
                )
            }
        }
    ]
    const loadQuestions = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/question/' })
        setLoading(false)
        setQuestions(data.questions)
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
                dataSource={questions?.map((val) => {
                    return { ...val, key: val._id }
                })}
                bordered={true}
            />
        </div>
    )
}
export default ListQuestions
