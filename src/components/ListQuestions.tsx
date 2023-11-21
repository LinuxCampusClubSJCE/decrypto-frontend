import { Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface question {
    _id: string
    image: string
    answer: string
    hint: string
    difficulty: number
}

const ListQuestions = () => {
    const navigate = useNavigate()
    const deleteQuestion = async (id: string) => {
        const data = await fetchData({
            path: `/question/${id}`,
            method: 'DELETE'
        })
        loadQuestions()
        if (data.success) {
            message.success(data.message)
        } else {
            message.error(data.message)
            navigator.vibrate(300)
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
    const loadQuestions = async () => {
        const data = await fetchData({ path: '/question/' })
        setQuestions(data.questions)
    }
    const [questions, setQuestions] = useState<question[]>()
    useEffect(() => {
        loadQuestions()
    }, [])
    return (
        <div>
            <Table
                className="max-w-full"
                size="small"
                columns={columns}
                dataSource={questions}
                bordered={true}
            />
        </div>
    )
}
export default ListQuestions
