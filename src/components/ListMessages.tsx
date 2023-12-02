import { useCallback, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { Layout, Table } from 'antd'

export const ListMessages = () => {
    interface Message {
        _id: string
        message: string
        creator: {
            username: string
            fullName: string
        }
        createdDate: Date
    }
    const loadMessages = useCallback(async () => {
        const data = await fetchData({ path: '/message/all' })
        setMessages(data.messages)
    }, [])
    useEffect(() => {
        loadMessages()
    }, [loadMessages])
    const [messages, setMessages] = useState<Message[]>([])
    const columns = [
        {
            title: 'Username',
            dataIndex: ['creator', 'username'],
            key: 'username'
        },
        {
            title: 'Full Name',
            dataIndex: ['creator', 'fullName'],
            key: 'fullName'
        },
        {
            title: 'Time',
            dataIndex: 'createdDate',
            key: 'createdDate',
            sorter: (a: Message, b: Message) =>
                new Date(a.createdDate).getTime() -
                new Date(b.createdDate).getTime(),
            render: (date: Date) => (
                <span>{new Date(date).toLocaleTimeString()}</span> // Displaying only time
            )
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message'
        }
    ]
    return (
        <Layout>
            <Table columns={columns} dataSource={messages} />
        </Layout>
    )
}
