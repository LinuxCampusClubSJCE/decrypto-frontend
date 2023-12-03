import { useCallback, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { Button, Layout, Table, message } from 'antd'

export const ListLogs = () => {
    interface Message {
        _id: string
        creator: {
            username: string
            fullName: string
        }
        ip: string
        message: string
        userAgent: string
        createdDate: Date
    }
    const loadMessages = useCallback(async () => {
        const data = await fetchData({ path: '/logs/all' })
        setMessages(data.logs)
    }, [])
    useEffect(() => {
        loadMessages()
    }, [loadMessages])
    const [logs, setMessages] = useState<Message[]>([])
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
            title: 'UserAgent',
            dataIndex: 'userAgent',
            key: 'userAgent'
        },
        {
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip'
        },
        {
            title: 'message',
            dataIndex: 'message',
            key: 'message'
        }
    ]
    return (
        <Layout>
            <Button
                onClick={async () => {
                    const data = await fetchData({
                        path: '/logs/all',
                        method: 'DELETE'
                    })
                    message.success(data.log)
                }}
            >
                Delete all Logs
            </Button>
            <Table title={() => 'Logs'} columns={columns} dataSource={logs} />
        </Layout>
    )
}
