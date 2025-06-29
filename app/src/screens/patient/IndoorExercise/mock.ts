import { Category, Exercise, TodayStats } from './types';

export const categories: Category[] = [
  { id: 'all', name: '전체', icon: '🏠' },
  { id: 'walking', name: '걷기', icon: '🚶‍♂️' },
  { id: 'strength', name: '근력', icon: '💪' },
  { id: 'balance', name: '균형', icon: '⚖️' },
];

export const exercises: Exercise[] = [
  {
    id: '1',
    name: '가벼운 걷기',
    description: '실내에서 안전하게 걷기 운동',
    duration: '10-15분',
    difficulty: '쉬움',
    icon: '🚶‍♂️',
    color: '#00D4AA',
    category: 'walking',
    target: '걸음 수 측정',
    benefits: ['근력 강화', '균형 감각 향상', '혈액순환 개선'],
    lastCompleted: '2시간 전',
    recommended: true,
    type: 'essential',
  },
  {
    id: '2',
    name: '다리 스트레칭',
    description: '다리 근육 이완과 유연성 향상',
    duration: '8-10분',
    difficulty: '쉬움',
    icon: '🧘‍♀️',
    color: '#3182F6',
    category: 'strength',
    target: '관절 가동범위 측정',
    benefits: ['근육 이완', '관절 유연성', '통증 완화'],
    lastCompleted: '1일 전',
    recommended: false,
    type: 'essential',
  },
  {
    id: '6',
    name: '걷기 보조 운동',
    description: '걷기 전 준비 운동',
    duration: '5-8분',
    difficulty: '쉬움',
    icon: '🦯',
    color: '#6B7280',
    category: 'walking',
    target: '보행 능력 측정',
    benefits: ['보행 개선', '자신감 향상', '안전성'],
    lastCompleted: '30분 전',
    recommended: false,
    type: 'essential',
  },
  {
    id: '3',
    name: '서서하기 운동',
    description: '서서하는 다리 근력 강화 운동',
    duration: '12-15분',
    difficulty: '보통',
    icon: '💪',
    color: '#FF6B35',
    category: 'strength',
    target: '근력 측정',
    benefits: ['근력 강화', '균형 감각', '일상생활 개선'],
    lastCompleted: '3일 전',
    recommended: true,
    type: 'optional',
  },
  {
    id: '4',
    name: '앉아서 다리 운동',
    description: '앉은 자세에서 하는 다리 운동',
    duration: '10-12분',
    difficulty: '쉬움',
    icon: '🪑',
    color: '#8B5CF6',
    category: 'strength',
    target: '근력 측정',
    benefits: ['근력 강화', '안정성', '통증 완화'],
    lastCompleted: '5시간 전',
    recommended: false,
    type: 'optional',
  },
  {
    id: '5',
    name: '균형 운동',
    description: '균형 감각과 안정성 향상',
    duration: '8-10분',
    difficulty: '보통',
    icon: '⚖️',
    color: '#F59E0B',
    category: 'balance',
    target: '균형 측정',
    benefits: ['균형 감각', '안정성', '낙상 예방'],
    lastCompleted: '1주일 전',
    recommended: true,
    type: 'optional',
  },
];

export const todayStats: TodayStats = {
  completed: 2,
  total: 3,
  time: 25,
  streak: 5,
  weeklyGoal: 80,
};
