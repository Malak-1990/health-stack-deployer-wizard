
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

class LocationService {
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  getLocationUrl(location: LocationData): string {
    return `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
  }
}

export const locationService = new LocationService();
