import React, { useState, useEffect } from 'react';
import CalendarView from '../components/CalendarView';
import BookingForm from '../components/BookingForm';
import RoomList from '../components/RoomList';
import { useAuth0 } from '@auth0/auth0-react';
import { Calendar, User, BookOpen } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth0();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5001/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  const handleBookingSubmit = async (bookingData) => {
    try {
      const fullBookingData = {
        ...bookingData,
        user_email: user.email,
        user_name: user.name
      };
  
      const response = await fetch('http://localhost:5001/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullBookingData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }
  
      const data = await response.json();
      setBookings([...bookings, data]);
      alert('Booking created successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
  };

  const handleSelectEvent = (event) => {
    if (isAuthenticated) {
      setSelectedSlot({
        start: event.start,
        end: event.end,
        id: event.id,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Room Booking</h1>
          </div>
          <RoomList rooms={rooms} />
          {isAuthenticated && (
            <BookingForm
              rooms={rooms}
              onSubmit={handleBookingSubmit}
            />
          )}
        </div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Schedule</h2>
          </div>
          <div className="rounded-lg shadow-md overflow-hidden">
            <CalendarView
              bookings={bookings}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;