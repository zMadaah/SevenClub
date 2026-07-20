import { useEffect,  useState } from 'react';

import * as Location from 'expo-location';

export function useLocation(){

const [ location, setLocation ]= useState<Location.LocationObject | null>(null);

const [ permission, setPermission ] = useState(false);

useEffect(()=>{ async function startLocation(){

const { status } = await Location.requestForegroundPermissionsAsync();

if(status !== 'granted'){
    setPermission(false);
    return;
}
setPermission(true);

const current = await Location.getCurrentPositionAsync({

accuracy: Location.Accuracy.High
});

setLocation(current);
}

startLocation();

},[]);

return { location, permission };

}