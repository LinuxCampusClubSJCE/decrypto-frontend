import { Table, message } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import LoadingContext from '../utils/LoadingContext'

interface user {
    fullName: string
    username: string
    _id: string
    solvedQuestions: number
}

const ListUsers = () => {
    const navigate = useNavigate()
    const { setLoading } = useContext(LoadingContext)
    const deleteUser = async (id: string) => {
        setLoading(true)
        const data = await fetchData({
            path: `/users/${id}`,
            method: 'DELETE'
        })
        setLoading(false)
        loadUsers()
        if (data.success) {
            message.success(data.message)
        } else {
            message.error(data.message)
            navigator.vibrate(200)
        }
    }
    const columns = [
        {
            title: 'username',
            dataIndex: 'username',
            sorter: (a: user, b: user) =>
                a.username > b.username ? 1 : b.username > a.username ? -1 : 0
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            ellipsis: true,
            sorter: (a: user, b: user) =>
                a.fullName > b.fullName ? 1 : b.fullName > a.fullName ? -1 : 0
        },
        {
            title: 'no',
            dataIndex: 'solvedQuestions',
            width: 50,
            ellipsis: true,
            sorter: (a: user, b: user) => a.solvedQuestions - b.solvedQuestions
        },
        {
            title: 'Edit',
            dataIndex: '_id',
            width: 50,
            ellipsis: true,
            render: (_id: string) => {
                return (
                    <button onClick={() => navigate(`/adduser/${_id}`)}>
                        <EditOutlined />
                    </button>
                )
            }
        },
        {
            title: 'Delete',
            dataIndex: '_id',
            width: 50,
            ellipsis: true,
            render: (_id: string) => {
                return (
                    <button onClick={() => deleteUser(_id)}>
                        <DeleteOutlined className="text-red-600" />
                    </button>
                )
            }
        },
        {
            title: 'Team',
            dataIndex: 'isTeam',
            width: 50,
            ellipsis: true,
            render: (isTeam: boolean) => {
                return <p>{isTeam && <CheckOutlined />}</p>
            }
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            width: 50,
            ellipsis: true,
            render: (isAdmin: boolean) => {
                return <p>{isAdmin && <CheckOutlined />}</p>
            }
        }
    ]
    const loadUsers = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/users/' })
        setLoading(false)
        setUsers(data.users)
    }, [setLoading])
    const [users, setUsers] = useState<user[]>()
    useEffect(() => {
        loadUsers()
    }, [loadUsers])
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
            />
        </div>
    )
}
export default ListUsers
