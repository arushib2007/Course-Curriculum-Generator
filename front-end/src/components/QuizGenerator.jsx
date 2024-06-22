import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, CircularProgress, Box, Typography } from '@mui/material'

function QuizGenerator() {
  let { state } = useLocation()

  const [results, setResults] = useState([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false)
  const [quizContent, setQuizContent] = useState([])
  const [answers, setAnswers] = useState([])
  const [subjectSelected, setSubjectSelected] = useState(false)

  function requestChapters() {
    setIsLoadingSubjects(true)

    fetch('http://127.0.0.1:5000/generate_quiz', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        chapters: state.results,
      }),
    })
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const paragraphElement = doc.querySelector('p').innerText

        // Convert content in paragraphElement to an Array of items
        const myArray = paragraphElement.split('*')
        setResults(myArray)

        setIsLoadingSubjects(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setIsLoadingSubjects(false)
      })
  }

  function generateQuiz(e) {
    setIsLoadingQuiz(true)
    let topic = e.target.innerText

    fetch('http://127.0.0.1:5000/render_quiz', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        topic: topic,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        return res.json() // Parse response as JSON
      })
      .then((data) => {
        if (!data || !data.quizContent) {
          throw new Error('Invalid response from server')
        }
        setQuizContent(data.quizContent)
        setAnswers(Array(data.quizContent.length).fill('')) // Initialize answers array
        setIsLoadingQuiz(false)
        setSubjectSelected(true)
      })
      .catch((error) => {
        console.error('Error fetching quiz:', error)
        setIsLoadingQuiz(false)
        // Log the response text for debugging
        error.response
          .text()
          .then((text) => console.log('Server response:', text))
      })
  }

  function handleInput(index, answer) {
    const updatedAnswers = [...answers]
    updatedAnswers[index] = answer.toUpperCase() // Ensure answer is uppercase
    setAnswers(updatedAnswers)
  }

  function submitQuiz() {
    fetch('http://127.0.0.1:5000/submit_quiz', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        quizContent: quizContent,
        answers: answers,
      }),
    })
      .then((res) => res.json()) // Assuming server returns JSON
      .then((data) => {
        console.log('Quiz results:', data.results)
        // Handle quiz results as needed
      })
      .catch((error) => {
        console.error('Error submitting quiz:', error)
      })
  }

  // Automatically fires requestChapters() when component loads
  useEffect(() => {
    requestChapters()
  }, [])

  return (
    <>
      <h1>Quiz Generator</h1>

      {isLoadingQuiz && (
        <>
          <Typography variant="body1">
            Please allow time for quiz to render...
          </Typography>
          <br />
          <CircularProgress />
        </>
      )}

      {!isLoadingQuiz &&
        quizContent.map((question, index) => (
          <div key={index}>
            <h3>{question}</h3>
            <input
              type="text"
              value={answers[index] || ''}
              onChange={(e) => handleInput(index, e.target.value)}
              placeholder="Enter answer (A, B, C, D, E)"
            />
            <br />
          </div>
        ))}

      {subjectSelected && (
        <Button variant="contained" color="primary" onClick={submitQuiz}>
          Submit Quiz
        </Button>
      )}
      <br />

      {isLoadingSubjects ? (
        <>
          <Typography variant="body1">
            Please allow time for subjects to render...
          </Typography>
          <br />
          <CircularProgress />
          <br />
        </>
      ) : (
        !subjectSelected &&
        results.map((item, index) => (
          <div key={index}>
            {index !== 0 && index !== results.length - 1 && (
              <Box mb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generateQuiz}
                >
                  {item}
                </Button>
              </Box>
            )}
          </div>
        ))
      )}

      <Box mt={2}>
        <Button variant="contained">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Go Back
          </Link>
        </Button>
      </Box>
    </>
  )
}

export default QuizGenerator
