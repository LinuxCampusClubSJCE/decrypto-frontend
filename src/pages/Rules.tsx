import { List } from 'antd'

const Rules = () => {
    const data = [
        'It is a non-technical event by LCC, Anyone can participate',
        'Find the relation between the images and Guess the answer. Images need not be in correct order',
        'Know a fair bit about college, movies, series, famous people, companies, sports, places, games, meme, Apps/Websites, and some tech stuff, or might be friends with people who know about these things',
        "Answers Won't repeat",
        'You can Give answers in either uppercase or lowercase',
        "Don't use any special characters/symbols in the answer(just skip them if they are part of answer)",
        'Spaces in the answer are ignored',
        "For Example, if the answer is 'Linux Campus Club'. All these answers are valid: 'LinuxCampusClub', 'linuxcampusclub', 'Linux Campus Club', 'linux   campus club'",
        'In case of a tie, the person who has submitted first will be on top'
    ]

    return (
        <div>
            <List
                size="large"
                bordered
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        {index + 1}. {item}
                    </List.Item>
                )}
            />
        </div>
    )
}
export default Rules
