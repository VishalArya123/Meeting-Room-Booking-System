import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = ({ bookings, onSelectSlot, onSelectEvent }) => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const formattedEvents = bookings.map(booking => ({
      id: booking.id,
      title: `Room: ${booking.room_name}`,
      start: new Date(booking.start_time),
      end: new Date(booking.end_time),
    }));
    setEvents(formattedEvents);
  }, [bookings]);

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleView = (newView) => {
    setView(newView);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md bg-cover bg-center">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        selectable
        className="bg-gray-50 bg-opacity-80 backdrop-blur-sm rounded-lg"
        views={['month', 'week', 'day', 'agenda']}
        view={view}
        onView={handleView}
        date={date}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default CalendarView;