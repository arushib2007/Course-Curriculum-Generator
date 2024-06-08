// Material UI Imports
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Hero from "./Hero";

// React Router Imports
import { Link } from 'react-router-dom'

function Home() {
    return (
        <>
            <Hero />
            <Stack spacing={2} direction="row">
                <Button variant="contained">
                    <Link style={{textDecoration: 'none'}} to="/course_curriculum_generator">
                        Course Curriculum Generator
                    </Link>
                </Button>

            </Stack>
        </>
    );
}

export default Home;