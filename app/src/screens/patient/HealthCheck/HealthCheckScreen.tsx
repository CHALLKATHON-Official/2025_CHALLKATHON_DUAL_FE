import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Card from '../../../components/common/Card';
import { recordPainAfterExercise } from '../../../api';
import { useHealthRecord } from '../../../hooks/useHealthRecord';
import { styles } from './HealthCheckScreen.styled';
import { 
  HealthCheckScreenNavigationProp, 
  HealthCheckParams, 
  SymptomState, 
  BodyPart, 
  SymptomLevel 
} from './types';

// API 대신 사용할 로컬 상수
const bodyPartsData = [
  { id: 'leg' as BodyPart, name: '다리', icon: '🦵', description: '다리 전체' },
  { id: 'knee' as BodyPart, name: '무릎', icon: '🦴', description: '무릎 관절' },
  { id: 'ankle' as BodyPart, name: '발목', icon: '🦶', description: '발목 관절' },
  { id: 'heel' as BodyPart, name: '발뒤꿈치', icon: '👠', description: '발뒤꿈치' },
  { id: 'back' as BodyPart, name: '허리', icon: '🔴', description: '허리 부위' },
];

const symptomLevelsData = [
  { id: 'good' as SymptomLevel, name: '좋음', color: '#10B981', bgColor: '#E8F5E8', icon: '😊', description: '불편함 없음' },
  { id: 'mild' as SymptomLevel, name: '가벼운 불편', color: '#F59E0B', bgColor: '#FEF3E2', icon: '😐', description: '약간의 불편함' },
  { id: 'moderate' as SymptomLevel, name: '보통 불편', color: '#F97316', bgColor: '#FEE8D5', icon: '😟', description: '보통 정도의 불편함' },
  { id: 'severe' as SymptomLevel, name: '심한 불편', color: '#EF4444', bgColor: '#FEE8E8', icon: '😰', description: '심각한 불편함' },
];

const HealthCheckScreen: React.FC = () => {
  const navigation = useNavigation<HealthCheckScreenNavigationProp>();
  const route = useRoute();
  const params = route.params as HealthCheckParams;
  
  const [symptoms, setSymptoms] = useState<SymptomState>({
    leg: null,
    knee: null,
    ankle: null,
    heel: null,
    back: null,
  });
  
  const [detailNotes, setDetailNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSymptomSelect = (bodyPart: BodyPart, level: SymptomLevel) => {
    setSymptoms(prev => ({
      ...prev,
      [bodyPart]: prev[bodyPart] === level ? null : level
    }));
  };

  const handleSubmit = () => {
    // 모든 부위에 대해 체크했는지 확인
    const uncheckedParts = bodyPartsData.filter(part => !symptoms[part.id]);
    
    if (uncheckedParts.length > 0) {
      Alert.alert(
        '체크 미완료',
        `다음 부위의 상태를 체크해주세요:\n${uncheckedParts.map(part => part.name).join(', ')}`,
        [{ text: '확인' }]
      );
      return;
    }

    // 심한 증상이 있는지 확인
    const severeSymptoms = bodyPartsData.filter(part => symptoms[part.id] === 'severe');
    
    if (severeSymptoms.length > 0) {
      Alert.alert(
        '주의 필요',
        `다음 부위에 심한 증상이 있습니다:\n${severeSymptoms.map(part => part.name).join(', ')}\n\n의료진과 상담을 권장합니다.`,
        [
          { text: '확인', onPress: saveAndExit }
        ]
      );
    } else {
      saveAndExit();
    }
  };

  const saveAndExit = async () => {
    try {
      setIsSubmitting(true);

      // 증상 레벨을 점수로 변환 (good: 0, mild: 1, moderate: 2, severe: 3)
      const levelToScore = (level: SymptomLevel | null): number => {
        if (!level) return 0;
        switch (level) {
          case 'good': return 0;
          case 'mild': return 1;
          case 'moderate': return 2;
          case 'severe': return 3;
          default: return 0;
        }
      };

      const painRecord = {
        legPainScore: levelToScore(symptoms.leg),
        kneePainScore: levelToScore(symptoms.knee),
        anklePainScore: levelToScore(symptoms.ankle),
        heelPainScore: levelToScore(symptoms.heel),
        backPainScore: levelToScore(symptoms.back),
        notes: detailNotes || `${params?.exerciseName || '운동'} 후 건강 상태 기록`,
      };

      console.log('운동 후 통증 기록 전송:', painRecord);
      
      // 운동 후 통증 기록 API 호출
      const result = await recordPainAfterExercise(painRecord);
      console.log('운동 후 통증 기록 성공:', result);

      Alert.alert(
        '건강 상태 기록 완료',
        result || '운동 후 건강 상태가 기록되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              // 실내 운동 메인으로 돌아가기
              navigation.navigate('IndoorToday' as never);
            }
          }
        ]
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '건강 상태 기록 저장에 실패했습니다.';
      console.error('건강 상태 기록 저장 오류:', err);
      Alert.alert(
        '저장 실패', 
        errorMessage,
        [
          {
            text: '확인',
            onPress: () => {
              // 저장에 실패해도 메인으로 돌아가기
              navigation.navigate('IndoorToday' as never);
            }
          }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    Alert.alert(
      '기록 중단',
      '건강 상태 기록을 중단하시겠습니까?\n기록하지 않고 나가시겠습니까?',
      [
        { text: '계속 기록', style: 'cancel' },
        {
          text: '나가기',
          style: 'destructive',
          onPress: () => navigation.navigate('IndoorToday' as never)
        }
      ]
    );
  };

  const getSelectedCount = () => {
    return Object.values(symptoms).filter(symptom => symptom !== null).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Feather name="chevron-left" size={28} color="#A3A8AF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>건강 상태 체크</Text>
          <Text style={styles.headerSubtitle}>
            {params?.exerciseName || '운동'} 후 몸의 상태를 확인해주세요
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {getSelectedCount()}/{bodyPartsData.length}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 안내 카드 */}
        <View style={styles.section}>
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIcon}>
                <Feather name="heart" size={24} color="#3182F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>운동 후 건강 상태</Text>
                <Text style={styles.infoDescription}>
                  각 부위별로 운동 후 느끼는 상태를 정확히 체크해주세요
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* 증상 레벨 범례 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상태 구분</Text>
          <Card style={styles.legendCard}>
            <View style={styles.legendContainer}>
              {symptomLevelsData.map((level) => (
                <View key={level.id} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: level.color }]} />
                  <Text style={styles.legendName}>{level.name}</Text>
                  <Text style={styles.legendDescription}>{level.description}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* 신체 부위별 체크 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>부위별 상태</Text>
          <View style={styles.bodyPartsContainer}>
            {bodyPartsData.map((bodyPart) => (
              <Card key={bodyPart.id} style={styles.bodyPartCard}>
                <View style={styles.bodyPartHeader}>
                  <View style={styles.bodyPartInfo}>
                    <Text style={styles.bodyPartIcon}>{bodyPart.icon}</Text>
                    <View style={styles.bodyPartText}>
                      <Text style={styles.bodyPartName}>{bodyPart.name}</Text>
                      <Text style={styles.bodyPartDescription}>{bodyPart.description}</Text>
                    </View>
                  </View>
                  {symptoms[bodyPart.id] && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedText}>
                        {symptomLevelsData.find(l => l.id === symptoms[bodyPart.id])?.name}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.symptomButtons}>
                  {symptomLevelsData.map((level) => (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.symptomButton,
                        { backgroundColor: level.bgColor },
                        symptoms[bodyPart.id] === level.id && {
                          backgroundColor: level.color,
                          transform: [{ scale: 1.1 }],
                        }
                      ]}
                      onPress={() => handleSymptomSelect(bodyPart.id as BodyPart, level.id as SymptomLevel)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.symptomButtonIcon,
                        { color: level.color },
                        symptoms[bodyPart.id] === level.id && { color: '#FFFFFF' }
                      ]}>
                        {level.icon}
                      </Text>
                      <Text style={[
                        styles.symptomButtonText,
                        { color: level.color },
                        symptoms[bodyPart.id] === level.id && { color: '#FFFFFF' }
                      ]}>
                        {level.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* 상세 기록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상세 기록</Text>
          <Card style={styles.detailCard}>
            <Text style={styles.detailLabel}>그 밖에 느낀 점이나 특이사항</Text>
            <TextInput
              style={styles.detailInput}
              placeholder="예: 운동 중 특정 동작에서 불편함을 느꼈거나, 평소와 다른 점이 있다면 자세히 적어주세요..."
              placeholderTextColor="#A3A8AF"
              value={detailNotes}
              onChangeText={setDetailNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.detailHint}>
              💡 정확한 기록은 더 나은 운동 계획 수립에 도움이 됩니다
            </Text>
          </Card>
        </View>

        {/* 완료 버튼 */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              getSelectedCount() === bodyPartsData.length ? styles.submitButtonActive : styles.submitButtonInactive
            ]} 
            onPress={handleSubmit}
            disabled={getSelectedCount() < bodyPartsData.length || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={[
                  styles.submitButtonText,
                  getSelectedCount() === bodyPartsData.length ? styles.submitButtonTextActive : styles.submitButtonTextInactive
                ]}>
                  건강 상태 기록 완료
                </Text>
                <Feather 
                  name="check" 
                  size={20} 
                  color={getSelectedCount() === bodyPartsData.length ? "#FFFFFF" : "#A3A8AF"} 
                  style={styles.submitButtonIcon} 
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthCheckScreen;
