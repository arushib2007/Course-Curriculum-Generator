import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, CircularProgress, Box, Typography } from '@mui/material'

function QuizGenerator() {
  let { state } = useLocation()

  const [results, setResults] = useState([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false)
  const [quizContent, setQuizContent] = useState([])
  const [quizResults, setQuizResults] = useState('')
  const [firstAnswer, setFirstAnswer] = useState('')
  const [secondAnswer, setSecondAnswer] = useState('')
  const [thirdAnswer, setThirdAnswer] = useState('')
  const [fourthAnswer, setFourthAnswer] = useState('')
  const [fifthAnswer, setFifthAnswer] = useState('')
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
      .catch((res) => {
        console.error(res)
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
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const paragraphElement = doc.querySelector('p').innerText
        const myArray = paragraphElement.split('**')

        setQuizContent(myArray)
        setIsLoadingQuiz(false)
        setSubjectSelected(true)
      })
      .catch((res) => {
        console.error(res)
        setIsLoadingQuiz(false)
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

  function submitQuiz() {
    fetch('http://127.0.0.1:5000/submit_quiz', {
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

        setQuizResults(myArray)
        setIsLoadingQuiz(false)
      })
      .catch((res) => {
        console.error(res)
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
            Please allow time for results to render...
          </Typography>
          <CircularProgress />
        </>
      )}

      {!isLoadingQuiz &&
        quizContent.map((item, index) => (
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
              <>
                <h1>{item}</h1>
              </>
            )}
          </div>
        ))}

      {subjectSelected && (
        <Button variant="contained" color="primary" onClick={submitQuiz}>
          Submit Quiz
        </Button>
      )}
      <br />

      {isLoadingSubjects ? (
        <CircularProgress />
      ) : (
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
