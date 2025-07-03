import React, { useState } from 'react';
import { Users, Monitor, Tv, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const Rooms = () => {
  const [activeCarousel, setActiveCarousel] = useState({});

  const rooms = [
    {
      id: 1,
      name: "Conference Room A",
      capacity: 10,
      equipment: ["Projector", "Whiteboard"],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
      ]
    },
    {
      id: 2,
      name: "Meeting Room B",
      capacity: 6,
      equipment: ["TV", "Whiteboard"],
      images: [
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop"
      ]
    },
    {
      id: 3,
      name: "Boardroom",
      capacity: 20,
      equipment: ["Projector", "TV", "Whiteboard"],
      images: [
        "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=600&h=400&fit=crop"
      ]
    }
  ];

  const getEquipmentIcon = (equipment) => {
    switch (equipment) {
      case 'Projector':
        return <Monitor className="w-5 h-5" />;
      case 'TV':
        return <Tv className="w-5 h-5" />;
      case 'Whiteboard':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const nextImage = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    const currentIndex = activeCarousel[roomId] || 0;
    const nextIndex = (currentIndex + 1) % room.images.length;
    setActiveCarousel(prev => ({ ...prev, [roomId]: nextIndex }));
  };

  const prevImage = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    const currentIndex = activeCarousel[roomId] || 0;
    const prevIndex = currentIndex === 0 ? room.images.length - 1 : currentIndex - 1;
    setActiveCarousel(prev => ({ ...prev, [roomId]: prevIndex }));
  };

  const goToImage = (roomId, index) => {
    setActiveCarousel(prev => ({ ...prev, [roomId]: index }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Our Meeting Rooms
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium meeting spaces designed for collaboration and productivity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {rooms.map((room) => {
            const currentImageIndex = activeCarousel[room.id] || 0;
            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image Carousel */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.images[currentImageIndex]}
                    alt={`${room.name} - View ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  
                  {/* Carousel Controls */}
                  <button
                    onClick={() => prevImage(room.id)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => nextImage(room.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {room.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(room.id, index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'bg-white scale-110'
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {room.name}
                  </h2>
                  
                  {/* Capacity */}
                  <div className="flex items-center mb-4 text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-lg font-medium">
                      Capacity: {room.capacity} people
                    </span>
                  </div>

                  {/* Equipment */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Equipment Available:
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {room.equipment.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                        >
                          <span className="text-blue-600 mr-2">
                            {getEquipmentIcon(item)}
                          </span>
                          <span className="text-gray-700 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Premium Meeting Spaces
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our meeting rooms are designed with modern aesthetics and equipped with cutting-edge technology 
              to ensure your meetings are productive and professional. Each space offers natural lighting, 
              comfortable seating, and all the amenities you need for successful collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;