import { List } from 'antd'

const Rules = () => {
    const data = [
        'Find the relation between the images and Guess the answer.',
        'In case of a tie, the person who has submitted first will be on top',
        "Answers Won't repeat",
        "Don't use any special characters/symbols in the answer(just skip them if they are part of answer)",
        'Minimum length of answer is 3 and maximum is 40',
        'You can Give answers in either uppercase or lowercase',
        'Spaces in the answer are ignored',
        "For Example, if the answer is 'Linux Campus Club'. All these answers are vaild: 'LinuxCampusClub', 'linuxcampusclub', 'Linux Campus Club', 'linux   campus club'"
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
