import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');

type LocationPermissionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LocationPermission'
>;

interface LocationPermissionScreenProps {
  onBack?: () => void;
}

const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onBack,
}) => {
  const navigation = useNavigation<LocationPermissionScreenNavigationProp>();

  const handleYesAllow = () => {
    navigation.navigate('Login');
  };

  const handleEssentialOnly = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#026A49" />
      
      {/* Header with back arrow */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </View>

      {/* Main content container */}
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          
          {/* Privacy Info Section */}
          <View style={styles.privacyInfo}>
            <Text style={styles.title}>Allow Location</Text>
            <Text style={styles.description}>
              To personalise what you see from us, we collect info about your location. This helps us (and trusted partners) show you nearby offers, bundles, and services tailored to you.
              {'\n'}Read our Location Policy.
            </Text>
          </View>

          {/* Button Container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleYesAllow}>
              <Text style={styles.primaryButtonText}>Yes, Allow</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleEssentialOnly}>
              <Text style={styles.secondaryButtonText}>Only Allow Essential Access</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#026A49',
  },
  header: {
    backgroundColor: '#026A49',
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    height: 56,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  placeholder: {
    width: 48,
    height: 48,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
    minHeight: 413,
  },
  privacyInfo: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'System',
  },
  description: {
    fontSize: 20,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 28,
    fontFamily: 'System',
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#026A49',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'System',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'System',
  },
});

export default LocationPermissionScreen;
