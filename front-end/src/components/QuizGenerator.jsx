import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, CircularProgress, Box, Typography } from '@mui/material'

function QuizGenerator() {
  let { state } = useLocation()

  const [results, setResults] = useState([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [quizContent, setQuizContent] = useState([])
  const [quizResults, setQuizResults] = useState('')
  const [firstAnswer, setFirstAnswer] = useState('')
  const [secondAnswer, setSecondAnswer] = useState('')
  const [thirdAnswer, setThirdAnswer] = useState('')
  const [fourthAnswer, setFourthAnswer] = useState('')
  const [fifthAnswer, setFifthAnswer] = useState('')
  const [showSubmitButton, setShowSubmitButton] = useState(false)
  const [gradedResponse, setGradedResponse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(null) // State to track selected subject

  function requestChapters() {
    setLoadingSubjects(true)

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
        const myArray = paragraphElement.split('*')
        setResults(myArray)
        setLoadingSubjects(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoadingSubjects(false)
      })
  }

  function generateQuiz(e) {
    setLoadingQuiz(true)
    let topic = e.target.innerText

    setSelectedSubject(topic) // Set selected subject

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
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const paragraphElement = doc.querySelector('p').innerText
        const myArray = paragraphElement.split('**')
        setQuizContent(myArray)
        setLoadingQuiz(false)
        setShowSubmitButton(true) // Show submit button after quiz is rendered
      })
      .catch((error) => {
        console.error('Error fetching quiz:', error)
        setLoadingQuiz(false)
      })
  }

  function handleInput(e, index) {
    switch (index) {
      case 2:
        setFirstAnswer(e.target.value)
        break
      case 4:
        setSecondAnswer(e.target.value)
        break
      case 6:
        setThirdAnswer(e.target.value)
        break
      case 8:
        setFourthAnswer(e.target.value)
        break
      case 10:
        setFifthAnswer(e.target.value)
        break
      default:
        break
    }
  }

  function submitQuiz(e) {
    e.preventDefault()
    setLoadingQuiz(true)

    fetch('https://course-curriculum-generator-db9f1560d821.herokuapp.com/submit_quiz', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        quizContent: quizContent.join(' '),
        firstAnswer: firstAnswer,
        secondAnswer: secondAnswer,
        thirdAnswer: thirdAnswer,
        fourthAnswer: fourthAnswer,
        fifthAnswer: fifthAnswer,
      }),
    })
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const paragraphElement = doc.querySelector('p').innerText
        const myArray = paragraphElement.split('**')
        setGradedResponse(myArray)
        setLoadingQuiz(false)
        setShowSubmitButton(false) // Hide submit button after submission
        setQuizContent([]) // Clear quiz content
        setSelectedSubject(null) // Reset selected subject
      })
      .catch((error) => {
        console.error('Error submitting quiz:', error)
        setLoadingQuiz(false)
      })
  }

  // Automatically fires requestChapters() when component loads
  useEffect(() => {
    requestChapters()
  }, [])

  return (
    <>
      <h1>Quiz Generator</h1>

      {loadingQuiz && (
        <>
          <Typography variant="body1">
            Please allow time for quiz to render...
          </Typography>
          <br />
          <CircularProgress />
        </>
      )}

      {!loadingQuiz && quizContent.length > 0 && (
        <>
          {quizContent.map((item, index) => (
            <div key={index}>
              {index % 2 === 0 && index !== 0 ? (
                <>
                  <p>{item}</p>
                  <input
                    onChange={(e) => handleInput(e, index)}
                    placeholder="Add answer here..."
                  />
                  <br />
                </>
              ) : (
                <h3>{item}</h3>
              )}
            </div>
          ))}

          {showSubmitButton && (
            <Button variant="contained" color="primary" onClick={submitQuiz}>
              Submit Quiz
            </Button>
          )}
        </>
      )}

      {gradedResponse && (
        <Box mt={2} p={2} border={1} borderColor="primary.main">
          <Typography variant="h6">Graded Response:</Typography>
          <Typography variant="body1">{gradedResponse}</Typography>
        </Box>
      )}

      {loadingSubjects ? (
        <>
          <Typography variant="body1">
            Please allow time for subjects to render...
          </Typography>
          <br />
          <CircularProgress />
          <br />
        </>
      ) : (
        results.map((item, index) => (
          <div key={index}>
            {selectedSubject !== item && ( // Render button only if it's not the selected subject
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
        <Button variant="contained" component={Link} to="/" color="primary">
          Go Back
        </Button>
      </Box>
    </>
  )
}

export default QuizGenerator
