export async function geocodeAddress(address) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
  );

  const data = await res.json();

  if (!data.length) return null;

  return {
    lat: data[0].lat,
    lon: data[0].lon,
  };
}
