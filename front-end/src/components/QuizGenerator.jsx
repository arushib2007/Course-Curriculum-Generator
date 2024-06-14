import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function QuizGenerator() {
    let { state } = useLocation();

    const [ results, setResults ] = useState(state.results);
    const [ loading, setIsLoading ] = useState(false);

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

            setResults(paragraphElement);
            setIsLoading(false);
            // console.log(data);
        })
        .catch((res) => {
            console.error(res);
        });

        console.log("test");
    }

    useEffect(() => {
        requestChapters();
    }, []);

    return (
        <>
            <h1>QuizGenerator Component</h1>
            {/* 
            
                Generate Selection Mechanism for the User 

                From a Dropdown, Select the Chapter That You
                Want to Generate a Quiz From
            
            */}
            <p>Results: {results}</p>
            <p>Chapters: {state.chapters}</p>
            <Link to="/">Go Back</Link>
        </>
    );
}

export default QuizGenerator;