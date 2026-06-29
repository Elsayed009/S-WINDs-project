
import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getRiskColor } from '../utils/riskColors';

const MapView = ({ routePolyline, waypoints, origin, destination }) => {
  if (!routePolyline || routePolyline.length === 0) {
    return (
      <div style={styles.placeholder}>
        Map data not available for this trip.
      </div>
    );
  }

  // نحسب نقطة وسط المسار عشان الخريطة تفتح مركزة عليها مباشرة
  const centerIndex = Math.floor(routePolyline.length / 2);
  const center = routePolyline[centerIndex];

  return (
    <div style={styles.mapWrapper}>
      <MapContainer
        center={center}
        zoom={8}
        style={styles.map}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* خط المسار الكامل */}
        <Polyline
          positions={routePolyline}
          pathOptions={{ color: '#0070C0', weight: 4, opacity: 0.85 }}
        />

        {/* نقطة البداية */}
        {origin && (
          <Marker position={[origin.lat, origin.lng]}>
            <Popup>Start: {origin.address || 'Origin'}</Popup>
          </Marker>
        )}

        {/* نقطة النهاية */}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>End: {destination.address || 'Destination'}</Popup>
          </Marker>
        )}

        {/* دوائر ملونة عند كل waypoint حسب درجة الخطورة */}
        {waypoints && waypoints.map((wp, i) => (
          <CircleMarker
            key={i}
            center={[wp.location.lat, wp.location.lng]}
            radius={8}
            pathOptions={{
              color: getRiskColor(wp.weather.riskLevel),
              fillColor: getRiskColor(wp.weather.riskLevel),
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <strong>KM {Math.round(wp.distanceFromStart)}</strong><br />
              {wp.weather.description || wp.weather.condition}<br />
              Safe speed: {wp.maxSafeSpeed} km/h
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

const styles = {
  mapWrapper: {
    width: '100%', height: '400px', borderRadius: '12px',
    overflow: 'hidden', border: '1px solid #2a2f3a',
  },
  map: { width: '100%', height: '100%' },
  placeholder: {
    width: '100%', height: '400px', borderRadius: '12px',
    background: '#11151c', border: '1px solid #2a2f3a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#8a93a3', fontSize: '0.9rem',
  },
};

export default MapView;