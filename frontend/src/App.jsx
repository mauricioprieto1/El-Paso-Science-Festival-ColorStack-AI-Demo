import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import DrawPage from './pages/DrawPage'
import GalleryPage from './pages/GalleryPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative z-1 h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DrawPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
