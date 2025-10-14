import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SalonMap = ({ stores, userLocation }) => {
  // Default center: user's location or first store or fallback
  const defaultPosition =
    userLocation && userLocation.lat && userLocation.lng
      ? [userLocation.lat, userLocation.lng]
      : stores.length > 0 && stores[0].location
      ? [stores[0].location.lat, stores[0].location.lng]
      : [25.4358, 81.8463]; // Allahabad fallback

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userLocation && userLocation.lat && userLocation.lng && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
      {stores.map(store =>
        store.location && store.location.lat && store.location.lng ? (
          <Marker
            key={store._id}
            position={[store.location.lat, store.location.lng]}
          >
            <Popup>
              <b>{store.storename}</b>
              <br />
              {store.address?.city || ""}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default SalonMap;