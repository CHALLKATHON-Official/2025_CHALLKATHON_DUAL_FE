import { useState, useEffect } from 'react';
import { IndoorExerciseStatus, getIndoorExerciseStatus } from '../api';

export const useIndoorExercises = () => {
  const [exerciseData, setExerciseData] = useState<IndoorExerciseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIndoorExerciseStatus();
      setExerciseData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '실내운동 현황을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('실내운동 현황 로딩 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshExercises = () => {
    loadExercises();
  };

  useEffect(() => {
    loadExercises();
  }, []);

  return {
    exerciseData,
    loading,
    error,
    refreshExercises,
  };
};
