// Custom hooks for data fetching and state management
import { useState, useEffect, useCallback } from 'react';
import { listMeditations, toggleLikeMeditation } from '../api/meditation';
import { listMusic } from '../api/music';
import { fetchUserStats } from '../api/user';
import type { MeditationResponse, MusicResponse, UserStatsResponse } from '../types/api';
import { handleApiError } from '../utils/errorHandling';

export const useMeditations = () => {
  const [meditations, setMeditations] = useState<MeditationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeditations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listMeditations();
      setMeditations(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleLike = useCallback(async (id: number) => {
    try {
      const updated = await toggleLikeMeditation(id);
      setMeditations(prev =>
        prev.map(med => med.id === id ? updated : med)
      );
    } catch (err) {
      setError(handleApiError(err));
    }
  }, []);

  useEffect(() => {
    loadMeditations();
  }, [loadMeditations]);

  return {
    meditations,
    loading,
    error,
    refetch: loadMeditations,
    toggleLike,
  };
};

export const useMusicLibrary = () => {
  const [music, setMusic] = useState<MusicResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMusic = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listMusic();
      setMusic(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMusic();
  }, [loadMusic]);

  return {
    music,
    loading,
    error,
    refetch: loadMusic,
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserStats();
      setStats(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
  };
};