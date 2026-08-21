import { useRef, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { totalDistance, LatLng } from '../utils/geo';

export function useActivityTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [points, setPoints] = useState<LatLng[]>([]);

  const watchSubscription = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const distanceMeters = totalDistance(points);

  const paceLabel = (() => {
    if (distanceMeters < 10 || elapsedSeconds === 0) return '--:--';
    const paceSecondsPerKm = elapsedSeconds / (distanceMeters / 1000);
    const min = Math.floor(paceSecondsPerKm / 60);
    const sec = Math.round(paceSecondsPerKm % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  })();

  function startTimer() {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function startWatching() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    watchSubscription.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 5 },
      (loc) => {
        setPoints((prev) => [
          ...prev,
          { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
        ]);
      }
    );
  }

  function stopWatching() {
    watchSubscription.current?.remove();
    watchSubscription.current = null;
  }

  async function start() {
    setIsRunning(true);
    setIsPaused(false);
    startTimer();
    await startWatching();
  }

  function pause() {
    setIsPaused(true);
    stopTimer();
    stopWatching();
  }

  async function resume() {
    setIsPaused(false);
    startTimer();
    await startWatching();
  }

  function reset() {
    stopTimer();
    stopWatching();
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setPoints([]);
  }

  // limpa timer/watch se o componente desmontar com atividade em andamento
  useEffect(() => {
    return () => {
      stopTimer();
      stopWatching();
    };
  }, []);

  return {
    isRunning,
    isPaused,
    elapsedSeconds,
    distanceMeters,
    paceLabel,
    points,
    start,
    pause,
    resume,
    reset,
  };
}