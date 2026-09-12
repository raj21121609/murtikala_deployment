import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import DetailPage from './pages/DetailPage';
import BookingPage from './pages/BookingPage';
import TrackPage from './pages/TrackPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import MyBookingsPage from './pages/MyBookingsPage';
import { subscribeToAuthChanges, logoutUser } from './services/firebaseAuth';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'gallery' | 'detail' | 'book' | 'track' | 'auth' | 'admin' | 'mybookings'
  const [selectedMurtiId, setSelectedMurtiId] = useState(null);
  const [bookingMurtiId, setBookingMurtiId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Subscribe to Firebase Auth listener for persistent user session
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setActivePage('home');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            setSelectedMurtiId={setSelectedMurtiId}
            setBookingMurtiId={setBookingMurtiId}
            currentUser={currentUser}
          />
        )}

        {activePage === 'gallery' && (
          <GalleryPage
            setActivePage={setActivePage}
            setSelectedMurtiId={setSelectedMurtiId}
            setBookingMurtiId={setBookingMurtiId}
            currentUser={currentUser}
          />
        )}

        {activePage === 'detail' && (
          <DetailPage
            murtiId={selectedMurtiId}
            setActivePage={setActivePage}
            setBookingMurtiId={setBookingMurtiId}
            currentUser={currentUser}
          />
        )}

        {activePage === 'book' && (
          <BookingPage
            murtiId={bookingMurtiId}
            setActivePage={setActivePage}
            currentUser={currentUser}
          />
        )}

        {activePage === 'track' && (
          <TrackPage />
        )}

        {activePage === 'auth' && (
          <AuthPage
            onLoginSuccess={(user) => setCurrentUser(user)}
            setActivePage={setActivePage}
            bookingMurtiId={bookingMurtiId}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
          />
        )}

        {activePage === 'mybookings' && (
          <MyBookingsPage
            currentUser={currentUser}
            setActivePage={setActivePage}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
