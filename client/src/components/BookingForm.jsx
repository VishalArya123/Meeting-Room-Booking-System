import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Building, FileText, Calendar, AlertCircle,CheckCircle } from 'lucide-react';

const BookingForm = ({ rooms, onSubmit }) => {
  const { user, isAuthenticated } = useAuth0();
  const [selectedRoom, setSelectedRoom] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!isAuthenticated) {
      setError('Please log in to book a room');
      return;
    }
  
    if (!selectedRoom || !startTime || !endTime) {
      setError('Please fill in all fields');
      return;
    }
  
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const formatForMySQL = (date) => {
        return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
      };
  
      const bookingData = {
        room_id: selectedRoom,
        user_id: user.sub,
        user_email: user.email,
        user_name: user.name,
        start_time: formatForMySQL(startTime),
        end_time: formatForMySQL(endTime),
        purpose: purpose
      };
  
      await onSubmit(bookingData);
      
      setSelectedRoom('');
      setPurpose('');
      setStartTime(null);
      setEndTime(null);
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    
    return currentDate.getTime() < selectedDate.getTime();
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 bg-cover bg-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Building className="w-6 h-6 text-blue-600" />
          <span>Book a Room</span>
        </h2>
        <p className="text-gray-600 flex items-center space-x-2">
          <LogIn className="w-5 h-5 text-blue-600" />
          <span>Please log in to make a booking.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 bg-cover bg-center bg-opacity-80 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <Building className="w-6 h-6 text-blue-600" />
        <span>Book a Room</span>
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2 flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-600" />
            <span>Select Room</span>
          </label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          >
            <option value="">Select a room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Meeting Purpose</span>
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of meeting purpose"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Start Time</span>
            </label>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholderText="Select start time"
              filterTime={filterPassedTime}
              minDate={new Date()}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>End Time</span>
            </label>
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholderText="Select end time"
              filterTime={filterPassedTime}
              minDate={startTime || new Date()}
              required
              disabled={isSubmitting || !startTime}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white flex items-center space-x-2 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={isSubmitting}
        >
          <CheckCircle className="w-5 h-5" />
          <span>{isSubmitting ? 'Processing...' : 'Confirm Booking'}</span>
        </button>
      </form>
    </div>
  );
};

export default BookingForm;