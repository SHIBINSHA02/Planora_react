import { useState } from 'react'
import './App.css'
import TeacherScheduleSystem from './TeacherScheduleSystem'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TeacherScheduleSystem/>
    </>
  )
}

export default App
