import { BrowserRouter, Route, Routes } from 'react-router';

import About from '@/pages/About';
import Home from '@/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<div>페이지를 찾을 수 없습니다</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
