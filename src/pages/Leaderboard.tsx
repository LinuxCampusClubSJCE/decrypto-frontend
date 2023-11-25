import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchData } from '../utils/fetch'
import { Table } from 'antd'
import LoadingContext from '../utils/LoadingContext'
import { ColumnsType } from 'antd/es/table'

interface leaderboardType {
    _id: string
    rank: number
    username: string
    solvedQuestions: number
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

const Leaderboard = () => {
    const { setLoading } = useContext(LoadingContext)

    const loadData = useCallback(async () => {
        setLoading(true)
        const data = await fetchData({ path: '/users/leaderboard' })
        setLoading(false)
        if (data.success) {
            let lastVal =
                data.leaderboard.length !== 0 &&
                data.leaderboard[0].solvedQuestions
            let rank = 1
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
    }, [setLoading])
    useEffect(() => {
        loadData()
    }, [loadData])
    const [leaderboard, setLeaderboard] = useState<leaderboardType[]>([])
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
        <div>
            {userObj !== null && (
                <div className="text-center space-y-1 mt-2 shadow-lg p-2 bg-slate-200 w-[80%] max-w-xl mx-auto rounded-lg">
                    <p>Rank: {userRank}</p>
                    <p>Name: {userObj.fullName}</p>
                    <p>username: {userObj.username}</p>
                </div>
            )}
            <Table
                columns={columns}
                dataSource={leaderboard.map((val) => {
                    return { ...val, key: val._id }
                })}
                className="p-3"
            />
        </div>
    )
}
export default Leaderboard
