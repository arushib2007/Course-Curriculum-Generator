import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Slider,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material'

function CourseCurriculumGenerator() {
  // States
  const [subject, setSubject] = useState('')
  const [weeks, setWeeks] = useState(1)
  const [chapters, setChapters] = useState(1)
  const [tests, setTests] = useState(0)
  const [finalExamOrProject, setFinalExamOrProject] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState('')

  const weekMarks = [
    { value: 1, label: '1' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
  ]

  const chapterMarks = [
    { value: 1, label: '1' },
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 25, label: '25' },
  ]

  const testMarks = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
  ]

  function handleSubmit(e) {
    e.preventDefault()

    setIsLoading(true)

    fetch('http://127.0.0.1:5000/handle_submit', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        subject,
        weeks,
        chapters,
        tests,
        finalExamOrProject,
      }),
    })
      .then((res) => {
        setIsSubmitted(true)
        return res.text()
      })
      .then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        const paragraphElement = doc.querySelector('p').innerText
        const formattedResults = formatResults(paragraphElement)
        setResults(formattedResults)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error fetching data:', error)
      })
  }

  function formatResults(content) {
    const weeksContent = content.split('###')
    const formattedResults = weeksContent
      .map((weekContent) => {
        const chaptersContent = weekContent.split('---')
        return chaptersContent
          .slice(0, chapters)
          .map(
            (chapterContent, index) => `Chapter ${index + 1}: ${chapterContent}`
          )
          .join('\n')
      })
      .join('\n\n')

    return formattedResults
  }

  return (
    <>
      <h1>Student Agenda Generator</h1>
      <h5>
        This generator helps you create a study agenda for the course that you
        select, allowing you to have a better and more effective studying
        experience! To use this generator, just select the course and final exam
        format and drag the blue dot for the number of weeks, chapters, and
        tests.
      </h5>

      <br />

      <Box width={750}>
        {isLoading ? (
          <>
            <Typography variant="body1">
              Please allow time for results to render...
            </Typography>
            <br />
            <CircularProgress />
          </>
        ) : isSubmitted ? (
          <>
            <Paper
              elevation={3}
              style={{ padding: '16px', marginBottom: '8px' }}
            >
              <Typography variant="h6" gutterBottom>
                Study Agenda
              </Typography>
              <Typography variant="body1">{results}</Typography>
            </Paper>

            <br />
            <br />
            <Button variant="contained">
              <Link
                style={{ textDecoration: 'none', color: 'inherit' }}
                to="/quiz_generator"
                state={{ results }}
              >
                Quiz Generator
              </Link>
            </Button>
            <br />
            {/* <Button variant="contained">
              <Link
                style={{ textDecoration: 'none', color: 'inherit' }}
                to="/study_material_generator"
              >
                Study Material Generator
              </Link>
            </Button> */}
          </>
        ) : (
          <form onSubmit={handleSubmit} fullWidth>
            <FormControl fullWidth>
              <InputLabel id="subject-input">Subject</InputLabel>
              <Select
                labelId="subject-input"
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <MenuItem value="AP Statistics">AP Statistics</MenuItem>
                <MenuItem value="AP Chemistry">AP Chemistry</MenuItem>
                <MenuItem value="AP Calculus BC">AP Calculus BC</MenuItem>
                <MenuItem value="AP World History">AP World History</MenuItem>
                <MenuItem value="AP English Literature">
                  AP English Literature
                </MenuItem>
                <MenuItem value="AP Computer Science A">
                  AP Computer Science A
                </MenuItem>
              </Select>
            </FormControl>
            <br />
            <label>Number of Weeks</label>
            <Slider
              aria-label="Number of Weeks"
              onChange={(e) => setWeeks(e.target.value)}
              value={weeks}
              defaultValue={1}
              step={1}
              valueLabelDisplay="auto"
              marks={weekMarks}
              min={1}
              max={40}
            />
            <br />
            <label>Number of Chapters</label>
            <Slider
              aria-label="Number of Chapters"
              onChange={(e) => setChapters(e.target.value)}
              value={chapters}
              defaultValue={1}
              step={1}
              valueLabelDisplay="auto"
              marks={chapterMarks}
              min={1}
              max={25}
            />
            <label>Number of Tests</label>
            <br />
            <Slider
              aria-label="Number of Tests"
              onChange={(e) => setTests(e.target.value)}
              value={tests}
              defaultValue={0}
              step={1}
              valueLabelDisplay="auto"
              marks={testMarks}
              min={0}
              max={4}
            />
            <br />
            <br />
            <FormControl fullWidth>
              <InputLabel id="exam-or-project-input">
                Final Exam or Project?
              </InputLabel>
              <Select
                label="Final Exam or Project"
                labelId="exam-or-project-input"
                value={finalExamOrProject}
                onChange={(e) => setFinalExamOrProject(e.target.value)}
              >
                <MenuItem value="">Choose One</MenuItem>
                <MenuItem value="Final Exam">Final Exam</MenuItem>
                <MenuItem value="Project">Project</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </form>
        )}
      </Box>
      <br />
      <Button variant="contained">
        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/">
          Go Back
        </Link>
      </Button>
      <br />
    </>
  )
}

export default CourseCurriculumGenerator
