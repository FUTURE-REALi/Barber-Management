import fetch from 'node-fetch';

function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number'
  )
    return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getCoordinatesFromAddress(addressObj) {
  const addressString = `${addressObj.building || ''}, ${addressObj.street || ''}, ${addressObj.city || ''}, ${addressObj.state || ''}, ${addressObj.zip || ''}`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'PocketSalon/1.0' } });
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
  return null;
}

export const getDistanceFromAddresses = async (req, res) => {
  try {
    const { userAddress, storeAddress } = req.body;
    if (!userAddress || !storeAddress) {
      return res.status(400).json({ message: "userAddress and storeAddress are required" });
    }

    const userCoords = await getCoordinatesFromAddress(userAddress);
    const storeCoords = await getCoordinatesFromAddress(storeAddress);

    if (!userCoords || !storeCoords) {
      return res.status(400).json({ message: "Could not geocode one or both addresses" });
    }

    const distance = getDistanceKm(userCoords.lat, userCoords.lng, storeCoords.lat, storeCoords.lng);

    res.json({ distance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};