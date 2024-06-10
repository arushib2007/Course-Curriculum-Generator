import { Link } from 'react-router-dom';

function QuizGenerator(props) {
    return (
        <>
            <h1>QuizGenerator Component</h1>
            <p>Chapters: {props.chapters}</p>
            <Link to="/">Go Back</Link>
        </>
    );
}

export default QuizGenerator;