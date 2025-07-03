import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Clock, Trash2, Calendar } from 'lucide-react';

const BookingHistory = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching bookings for user:", user.sub);
        const token = await getAccessTokenSilently();
        console.log("Token:", token);
        
        const response = await fetch(`http://localhost:5001/bookings?user_id=${user.sub}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) throw new Error('Failed to fetch bookings');
        
        const data = await response.json();
        console.log("Received data:", data);
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, [isAuthenticated, user]);

  const handleCancel = async (bookingId) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:5001/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to cancel booking');
      
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      alert('Booking canceled successfully');
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 flex items-center justify-center space-x-2">
          <LogIn className="w-5 h-5 text-blue-600" />
          <span>Please log in to view your booking history.</span>
        </p>
      </div>
    );
  }

  if (loading) return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md">
      <p className="text-gray-600 flex items-center justify-center space-x-2">
        <Clock className="w-5 h-5 text-blue-600 animate-spin" />
        <span>Loading...</span>
      </p>
    </div>
  );

  if (error) return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md">
      <p className="text-red-500 flex items-center justify-center space-x-2">
        <AlertCircle className="w-5 h-5" />
        <span>Error: {error}</span>
      </p>
    </div>
  );

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Your Booking History</h2>
      </div>
      {bookings.length === 0 ? (
        <p className="text-gray-600 bg-white p-4 rounded-lg shadow-md">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center bg-opacity-80 backdrop-blur-sm">
              <div>
                <p className="text-gray-800 flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  <span><strong>Room:</strong> {booking.room_name}</span>
                </p>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span><strong>Start:</strong> {new Date(booking.start_time).toLocaleString()}</span>
                </p>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span><strong>End:</strong> {new Date(booking.end_time).toLocaleString()}</span>
                </p>
                {booking.purpose && (
                  <p className="text-gray-600 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span><strong>Purpose:</strong> {booking.purpose}</span>
                  </p>
                )}
              </div>
              <button
                onClick={() => handleCancel(booking.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;