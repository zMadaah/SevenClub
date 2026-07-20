import { Marker } from 'react-native-maps';

interface Props {
  latitude: number;
  longitude: number;
}

export default function UserLocation({
  latitude,  longitude,}: Props) {
  return (
    <Marker coordinate={{ latitude, longitude, }} />
  );
}