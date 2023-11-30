import { Table, Typography } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import LoadingContext from '../utils/LoadingContext'
const { Text } = Typography
interface user {
    fullName: string
    _id: string
    questionCount: number
}

const ListQuestionCount = () => {
    const { setLoading } = useContext(LoadingContext)

    const columns = [
        {
            title: 'Name',
            dataIndex: 'fullName',
            ellipsis: true,
            sorter: (a: user, b: user) =>
                a.fullName > b.fullName ? 1 : b.fullName > a.fullName ? -1 : 0
        },
        {
            title: 'Count',
            dataIndex: 'questionCount',
            sorter: (a: user, b: user) => a.questionCount - b.questionCount
        }
    ]
    const loadUsers = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/question/count' })
        setLoading(false)
        setUsers(data.users)
    }, [setLoading])
    const [users, setUsers] = useState<user[]>()
    useEffect(() => {
        loadUsers()
    }, [loadUsers])
    const totalQuestions = users?.reduce(
        (total, user) => total + user.questionCount,
        0
    )
    return (
        <div>
            <Table
                className="max-w-full"
                size="small"
                columns={columns}
                dataSource={users?.map((val) => {
                    return { ...val, key: val._id }
                })}
                bordered={true}
                footer={() => <Text>Total Questions: {totalQuestions}</Text>}
            />
        </div>
    )
}
export default ListQuestionCount
