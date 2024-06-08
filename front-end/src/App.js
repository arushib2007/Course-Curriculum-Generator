import logo from './logo.svg';
import './App.css';


import Home from './components/Home';
import CourseCurriculumGenerator from "./components/CourseCurriculumGenerator";
import QuizGenerator from "./components/QuizGenerator";
import StudyMaterialGenerator from "./components/StudyMaterialGenerator";

// React Router Imports
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/course_curriculum_generator",
    element: <CourseCurriculumGenerator />,
  },
  {
    path: "/quiz_generator",
    element: <QuizGenerator />,
  },
  {
    path: "/study_material_generator",
    element: <StudyMaterialGenerator />,
  },
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
