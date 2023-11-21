import { Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface user {
    fullname: string
    username: string
    _id: string
}

const ListUsers = () => {
    const navigate = useNavigate()
    const deleteUser = async (id: string) => {
        const data = await fetchData({
            path: `/users/${id}`,
            method: 'DELETE'
        })
        loadUsers()
        if (data.success) {
            message.success(data.message)
        } else {
            message.error(data.message)
            navigator.vibrate(300)
        }
    }
    const columns = [
        { title: 'username', dataIndex: 'username' },
        {
            title: 'no',
            dataIndex: 'solvedQuestions',
            width: 50,
            ellipsis: true
        },
        {
            title: 'Edit',
            dataIndex: '_id',
            width: 60,
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
            width: 60,
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
    const loadUsers = async () => {
        const data = await fetchData({ path: '/users/' })
        setUsers(data.users)
    }
    const [users, setUsers] = useState<user[]>()
    useEffect(() => {
        loadUsers()
    }, [])
    return (
        <div>
            <Table
                className="max-w-full"
                size="small"
                columns={columns}
                dataSource={users}
                bordered={true}
            />
        </div>
    )
}
export default ListUsers
