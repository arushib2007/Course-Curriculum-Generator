import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

function QuizGenerator() {
    let { state } = useLocation();

    const [ results, setResults ] = useState([]);
    const [ loading, setIsLoading ] = useState(false);
    const [ quizContent, setQuizContent ] = useState([]);
    const [ quizResults, setQuizResults ] = useState("");
    
    const [ firstAnswer, setFirstAnswer ] = useState("");
    const [ secondAnswer, setSecondAnswer ] = useState("");
    const [ thirdAnswer, setThirdAnswer ] = useState("");
    const [ fourthAnswer, setFourthAnswer ] = useState("");
    const [ fifthAnswer, setFifthAnswer ] = useState("");

    function requestChapters() {
        fetch('http://127.0.0.1:5000/generate_quiz', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                chapters: state.results
            })
        })
        .then(res => { 
            return res.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const paragraphElement = doc.querySelector('p').innerText;

            // Convert content in paragraphElement to an Array of items
            const myArray = paragraphElement.split('*');

            // Set return value of above .split invocation (Array) as value
            // for results
            setResults(myArray);

            setIsLoading(false);
            // console.log(data);
        })
        .catch((res) => {
            console.error(res);
        });
    }

    function generateQuiz(e) {
        let topic = e.target.innerText;
        
        fetch('http://127.0.0.1:5000/render_quiz', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                topic: topic
            })
        })
        .then(res => { 
            return res.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const paragraphElement = doc.querySelector('p').innerText;

            const myArray = paragraphElement.split("**")

            setQuizContent(myArray);
            setIsLoading(false);
        })
        .catch((res) => {
            console.error(res);
        });
    }

    function handleInput(e, index) {
        switch (index) {
            case 2:
                setFirstAnswer(e.target.value);
                break;
            case 4:
                setSecondAnswer(e.target.value);
                break;
            case 6:
                setThirdAnswer(e.target.value);
                break;
            case 8:
                setFourthAnswer(e.target.value);
                break;
            case 10:
                setFifthAnswer(e.target.value);
                break;
            default:
                break;
        }
    }

    function submitQuiz() {
        fetch('http://127.0.0.1:5000/submit_quiz', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                quizContent: quizContent.join(' '),
                firstAnswer: firstAnswer,
                secondAnswer: secondAnswer,
                thirdAnswer: thirdAnswer,
                fourthAnswer: fourthAnswer,
                fifthAnswer: fifthAnswer
            })
        })
        .then(res => { 
            return res.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const paragraphElement = doc.querySelector('p').innerText;

            const myArray = paragraphElement.split("**")

            setQuizResults(myArray);
            setIsLoading(false);
        })
        .catch((res) => {
            console.error(res);
        });
    }

    // Automatically fires requestChapters() when component loads
    useEffect(() => {
        requestChapters();
    }, []);

    return (
        <>
            <h1>Quiz Generator</h1>
            {/* 
            
                Generate Selection Mechanism for the User 

                From a Dropdown, Select the Chapter That You
                Want to Generate a Quiz From
            
            */}

            {quizContent.map((item, index) => (
                <>
                    { index % 2 == 0 && index != 0 ? (
                        <>
                            <p>{item}</p>
                            <input onChange={(e) => handleInput(e, index)} placeholder="Add answer here..."></input>
                            <br />
                        </>
                    ) : (
                        <>
                            <h1>{item}</h1>
                        </>
                    )}
                </>
            ))}

            <Button variant="contained" color="primary" onClick={submitQuiz}>Submit Quiz</Button>
            <br />

            {results.map((item, index) => (
                <>
                    { index != 0 && index != results.length - 1 ? (
                        <>
                            <Button key={index} variant="contained" color="primary" onClick={generateQuiz}>
                                {item}
                            </Button>
                            <br />
                        </>
                    ) : (
                        null
                    ) 
                    }
                </>
            ))}
            <Link to="/">Go Back</Link>
        </>
    );
}

export default QuizGenerator;