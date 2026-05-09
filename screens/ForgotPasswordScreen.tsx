import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  onSendResetLink?: (email: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onSendResetLink,
}) => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('Anthonyjack@gmail.com');

  const handleSendResetLink = () => {
    if (onSendResetLink) {
      onSendResetLink(email);
    }
    // Navigate to Reset Password screen
    navigation.navigate('ResetPassword');
  };

  const handleBack = () => {
    navigation.navigate('Login');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#026A49" />

      {/* Green Header with Back Arrow */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.arrowContainer}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
            </View>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      {/* Main content container positioned at bottom */}
      <View style={styles.contentWrapper}>
        <View style={styles.content}>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we'll send a link to reset your password.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputField}>
                <View style={styles.inputContent}>
                  <View style={styles.emailIconContainer}>
                    <View style={styles.emailIcon} />
                    <View style={styles.emailTriangle} />
                  </View>
                  <Text style={styles.emailText}>Anthonyjack@gmail.com</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Send Reset Link Button */}
          <TouchableOpacity style={styles.sendResetButton} onPress={handleSendResetLink}>
            <Text style={styles.sendResetButtonText}>Send Reset Link</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              <Text style={styles.loginRegularText}>Remember your password? </Text>
              <Text style={styles.loginLink} onPress={handleLoginPress}>Login</Text>
            </Text>
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
  safeArea: {
    backgroundColor: '#026A49',
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
    paddingVertical: 11.667,
    paddingHorizontal: 10,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  arrowLine: {
    position: 'absolute',
    width: 14,
    height: 2,
    backgroundColor: '#FFFFFF',
    left: 5,
  },
  arrowHead: {
    position: 'absolute',
    left: 0,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
  placeholder: {
    width: 48,
    height: 48,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },
  content: {
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 36,
    height: 398,
  },
  headerSection: {
    marginBottom: 32,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    lineHeight: 28.8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#475569',
    fontFamily: 'DM Sans',
    lineHeight: 24,
  },
  formSection: {
    gap: 16,
    marginBottom: 20,
  },
  inputContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    lineHeight: 21.6,
  },
  inputField: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#334155',
    fontFamily: 'Work Sans',
    lineHeight: 19.2,
  },
  emailIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emailIcon: {
    width: 15.8334,
    height: 13.3334,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 3.9173,
  },
  emailTriangle: {
    position: 'absolute',
    top: 5.58396,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#334155',
  },
  sendResetButton: {
    backgroundColor: '#026A49',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sendResetButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'DM Sans',
    lineHeight: 21.6,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
    textAlign: 'center',
  },
  loginRegularText: {
    fontWeight: '400',
    color: '#334155',
  },
  loginLink: {
    fontWeight: '700',
    color: '#009D66',
  },
});

export default ForgotPasswordScreen;