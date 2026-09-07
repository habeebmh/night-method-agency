import { Route, Routes } from 'react-router-dom'
import { HabeebEpkPage } from './pages/HabeebEpkPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/habeeb" element={<HabeebEpkPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
