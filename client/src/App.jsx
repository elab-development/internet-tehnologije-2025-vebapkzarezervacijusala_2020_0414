import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BuildingDetails from './pages/BuildingDetails';
import RoomDetails from './pages/RoomDetails';

function App() {
  const me = useAuthStore((s) => s.me);

  useEffect(() => {
    me();
  }, [me]);

  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col bg-gray-50'>
        <Navbar />

        <main className='flex-1 mx-auto w-full max-w-6xl px-4 py-6'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/building/:buildingId' element={<BuildingDetails />} />
            <Route path='/room/:roomId' element={<RoomDetails />} />

            <Route
              path='/login'
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />

            <Route
              path='/register'
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
