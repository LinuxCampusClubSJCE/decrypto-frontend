import { useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { Table } from 'antd'

interface leaderboardType {
    rank: number
    username: string
    solvedQuestions: number
}

const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank'
    },
    {
        title: 'Username',
        dataIndex: 'username'
    },
    {
        title: 'Question',
        dataIndex: 'solvedQuestions'
    }
]

const Leaderboard = () => {
    const loadData = async () => {
        const data = await fetchData({ path: '/users/leaderboard' })
        if (data.success) {
            const leaderboardData = data.leaderboard.map(
                (item: leaderboardType, index: number) => {
                    return {
                        ...item,
                        rank: index + 1
                    }
                }
            )

            setLeaderboard(leaderboardData)
        }
    }
    useEffect(() => {
        loadData()
    }, [])
    const [leaderboard, setLeaderboard] = useState<leaderboardType[]>([])
    return (
        <div>
            <Table columns={columns} dataSource={leaderboard} className="p-3" />
        </div>
    )
}
export default Leaderboard
