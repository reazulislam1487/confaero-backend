import fetch from "node-fetch";

export const getCoordinatesFromMapUrl = async (
  mapUrl: string,
): Promise<{ latitude: number; longitude: number }> => {
  if (!mapUrl) {
    throw new Error("Map URL is required");
  }

  /* ================================
     STEP 1: Resolve Short URL
     ================================ */

  const resolvedResponse = await fetch(mapUrl, {
    method: "GET",
    redirect: "follow",
  });

  const finalUrl = resolvedResponse.url;

  console.log("Resolved URL:", finalUrl);

  /* ================================
     STEP 2: Try @lat,lng pattern
     ================================ */

  const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

  if (atMatch) {
    return {
      latitude: parseFloat(atMatch[1]),
      longitude: parseFloat(atMatch[2]),
    };
  }

  const urlObj = new URL(finalUrl);
  const qParam = urlObj.searchParams.get("q");

  /* ================================
     STEP 3: If ?q=lat,lng
     ================================ */

  if (qParam && qParam.includes(",")) {
    const [lat, lng] = qParam.split(",");

    if (!isNaN(Number(lat)) && !isNaN(Number(lng))) {
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };
    }
  }

  /* ================================
     STEP 4: If ?q=Place Name
     ================================ */

  if (qParam) {
    return await geocodeByAddress(qParam);
  }

  /* ================================
     STEP 5: Try /place/Name
     ================================ */

  const placeMatch = finalUrl.match(/place\/([^/]+)/);

  if (placeMatch) {
    const placeName = decodeURIComponent(
      placeMatch[1].replace(/\+/g, " "),
    );

    return await geocodeByAddress(placeName);
  }

  throw new Error("Unable to extract location from URL");
};

/* =========================================
   Separate Geocode Function (Cleaner Code)
   ========================================= */

const geocodeByAddress = async (address: string) => {
  const cleanAddress = address.replace(/\+/g, " ");

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    cleanAddress,
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(geocodeUrl);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Geocoding failed: ${data.status}`);
  }

  const location = data.results[0].geometry.location;

  return {
    latitude: location.lat,
    longitude: location.lng,
  };
};