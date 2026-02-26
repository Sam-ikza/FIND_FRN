import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapRoom {
  _id: string;
  title: string;
  rent: number;
  location: { city: string; state: string; lat: number; lng: number };
  vacancyType: 'single' | 'shared';
}

interface Props {
  rooms: MapRoom[];
}

export default function RoomMap({ rooms }: Props) {
  const validRooms = rooms.filter(r => r.location?.lat && r.location?.lng);
  const center: [number, number] = validRooms.length > 0
    ? [validRooms[0].location.lat, validRooms[0].location.lng]
    : [12.9716, 77.5946];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validRooms.map(room => (
          <Marker key={room._id} position={[room.location.lat, room.location.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{room.title}</p>
                <p className="text-gray-600">₹{room.rent?.toLocaleString()}/mo</p>
                <p className="text-gray-500 capitalize">{room.vacancyType}</p>
                <Link to={`/rooms/${room._id}`} className="text-amber-600 hover:underline mt-1 block">
                  View Room →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
