import { useCallback, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { Button, Layout, Table, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { WhatsAppOutlined } from '@ant-design/icons'

const { Paragraph, Text } = Typography
interface leaderboardType {
    _id: string
    rank: number
    username: string
    fullName?: string
    solvedQuestions: number
    totalAttempts: number
}

const columns: ColumnsType<leaderboardType> = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        sorter: (a: leaderboardType, b: leaderboardType) => a.rank - b.rank,
        defaultSortOrder: 'ascend'
    },
    {
        title: 'Username',
        dataIndex: 'username',
        sorter: (a: leaderboardType, b: leaderboardType) =>
            a.username > b.username ? 1 : b.username > a.username ? -1 : 0
    },
    {
        title: 'Question',
        dataIndex: 'solvedQuestions'
    }
]
const columnsFF: ColumnsType<leaderboardType> = [
    {
        title: 'Username',
        dataIndex: 'username'
    },
    {
        title: 'Attempts',
        dataIndex: 'totalAttempts'
    }
]
const columnsBB: ColumnsType<leaderboardType> = [
    {
        title: 'Username',
        dataIndex: 'username'
    },
    {
        title: 'Cracked',
        dataIndex: 'totalCrack'
    }
]

const Leaderboard = () => {
    const [isLoading, setLoading] = useState(false)
    const loadData = useCallback(async () => {
        setLoading(true)
        const handleData = (
            data: any,
            setLeaderboard: React.Dispatch<
                React.SetStateAction<leaderboardType[]>
            >,
            isTeam: boolean
        ) => {
            if (data.success) {
                let lastVal =
                    data.leaderboard.length !== 0 &&
                    data.leaderboard[0].solvedQuestions
                let rank = 1
                if (isTeam) {
                    data.leaderboard = data.leaderboard.map(
                        (data: leaderboardType) => {
                            return { ...data, username: data.fullName }
                        }
                    )
                } else {
                    setBb(data.bigBrains)
                    setFf(data.fastFingers)
                }
                const leaderboardData = data.leaderboard.map(
                    (item: leaderboardType) => {
                        if (lastVal !== item.solvedQuestions) {
                            lastVal = item.solvedQuestions
                            rank++
                        }
                        return {
                            ...item,
                            rank
                        }
                    }
                )

                setLeaderboard(leaderboardData)
            }
        }

        const data = await fetchData({
            path: '/users/leaderboard'
        })
        handleData(data, setLeaderboard, false)
        const data2 = await fetchData({
            path: '/users/teamleaderboard'
        })
        handleData(data2, setLeaderboard2, true)

        setLoading(false)
    }, [setLoading])
    useEffect(() => {
        loadData()
    }, [loadData])
    const [leaderboard, setLeaderboard] = useState<leaderboardType[]>([])
    const [leaderboard2, setLeaderboard2] = useState<leaderboardType[]>([])
    const [ff, setFf] = useState<leaderboardType[]>([])
    const [bb, setBb] = useState<leaderboardType[]>([])
    let user = localStorage.getItem('user')
    let userObj: {
        _id: string
        fullName: string
        username: string
        email: string
    } | null = null
    let userRank = -1
    if (user !== null) {
        userObj = JSON.parse(user)
        const userInd = leaderboard.findIndex((i) => i._id === userObj?._id)
        if (userInd !== -1) {
            userRank = leaderboard[userInd].rank
        }
    }
    return (
        <Layout className="min-h-screen">
            {userObj !== null && userRank !== -1 && (
                <div className="text-center space-y-1 mt-2">
                    <Text>Rank: {userRank}</Text>
                    <Paragraph>Name: {userObj.fullName}</Paragraph>
                    <Paragraph>username: {userObj.username}</Paragraph>
                </div>
            )}
            <Button
                onClick={() => {
                    window.location.href =
                        'https://chat.whatsapp.com/LdalrkM859WACWVTm9Be1x'
                }}
                icon={<WhatsAppOutlined />}
            >
                Join for hints
            </Button>
            <Table
                loading={isLoading}
                columns={columns}
                title={() => 'Leaderboard'}
                dataSource={leaderboard.map((val) => {
                    return { ...val, key: val._id }
                })}
                className="p-3"
            />
            <Table
                loading={isLoading}
                columns={columnsBB}
                title={() => 'BB - (Big Brains) Most Cracked'}
                dataSource={bb.map((val) => {
                    return { ...val, key: val._id }
                })}
                className="p-3"
            />
            <Table
                loading={isLoading}
                columns={columnsFF}
                title={() => 'FF - (Fast Fingers) Most Tried'}
                dataSource={ff.map((val) => {
                    return { ...val, key: val._id }
                })}
                className="p-3"
            />

            <Table
                loading={isLoading}
                columns={columns}
                title={() => 'LCC Members'}
                dataSource={leaderboard2.map((val) => {
                    return { ...val, key: val._id }
                })}
                className="p-3"
            />
        </Layout>
    )
}
export default Leaderboard
