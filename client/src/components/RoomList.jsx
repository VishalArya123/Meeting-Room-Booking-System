import React from 'react';
import { Users, Video, Projector } from 'lucide-react';

const RoomList = ({ rooms }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md bg-cover bg-center">
      <div className="flex items-center space-x-3 mb-4">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Available Rooms</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="border border-gray-200 p-4 rounded-md bg-white bg-opacity-80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-medium text-gray-800 flex items-center space-x-2">
              <Projector className="w-5 h-5 text-blue-500" />
              <span>{room.name}</span>
            </h3>
            <p className="text-gray-600 flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Capacity: {room.capacity}</span>
            </p>
            <p className="text-gray-600 flex items-center space-x-2">
              <Video className="w-4 h-4 text-gray-500" />
              <span>Equipment: {room.equipment}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;