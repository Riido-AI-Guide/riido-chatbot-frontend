import { BrowserRouter, Route, Routes } from 'react-router';

import { RequireAuth } from '@/components/RequireAuth';
import { TooltipProvider } from '@/components/ui/tooltip';
import About from '@/pages/About';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Members from '@/pages/Members';

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider delay={100}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/members"
            element={
              <RequireAuth>
                <Members />
              </RequireAuth>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<div>페이지를 찾을 수 없습니다</div>} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
