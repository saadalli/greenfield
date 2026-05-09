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

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  onLogin?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
  onSignUp,
}) => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('Anthonyjack@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (onLogin) {
      onLogin(email, password);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#EF5D21" />
      
      {/* Orange Header */}
      <View style={styles.header}>
        <SafeAreaView>
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
      </View>

      {/* Main content container */}
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Get everything in one place.</Text>
            <Text style={styles.subtitle}>
              Logging in means faster checkout, tracked orders, and exclusive bundle deals
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

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputField}>
                <View style={styles.inputContent}>
                  <View style={styles.lockContainer}>
                    <View style={styles.lockShackle} />
                    <View style={styles.lockBody} />
                  </View>
                  <View style={styles.passwordDots}>
                    {[...Array(8)].map((_, i) => (
                      <View key={i} style={styles.dot} />
                    ))}
                  </View>
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <View style={styles.eyeContainer}>
                      <View style={styles.eyeOuter} />
                      <View style={styles.eyeInner} />
                      {!showPassword && <View style={styles.eyeSlash} />}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              <Text style={styles.signUpRegularText}>Don't have an account? </Text>
              <Text style={styles.signUpLink} onPress={onSignUp}>Sign up</Text>
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
    backgroundColor: '#EF5D21',
  },
  header: {
    backgroundColor: '#EF5D21',
    paddingBottom: 150,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    marginTop: -100,
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
  },
  headerSection: {
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    lineHeight: 28.8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    fontFamily: 'DM Sans',
    lineHeight: 20.8,
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
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
    fontWeight: '500',
    color: '#334155',
    fontFamily: 'DM Sans',
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
  lockContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lockShackle: {
    position: 'absolute',
    top: 1.66667,
    left: 5.83333,
    width: 8.33334,
    height: 7.5,
    backgroundColor: 'transparent',
    borderWidth: 1.66667,
    borderColor: '#000000',
    borderBottomWidth: 0,
    borderRadius: 4.16667,
  },
  lockBody: {
    position: 'absolute',
    top: 9.16669,
    left: 2.5,
    width: 15,
    height: 9.16667,
    backgroundColor: 'transparent',
    borderWidth: 1.66667,
    borderColor: '#000000',
    borderRadius: 1,
  },
  passwordDots: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  dot: {
    width: 3,
    height: 6,
    borderRadius: 1.5,
    backgroundColor: '#334155',
  },
  eyeIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeContainer: {
    position: 'relative',
    width: 20,
    height: 20,
  },
  eyeOuter: {
    position: 'absolute',
    top: 5,
    left: 2,
    width: 16,
    height: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  eyeInner: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
  },
  eyeSlash: {
    position: 'absolute',
    top: 3,
    left: -2,
    width: 24,
    height: 2,
    backgroundColor: '#334155',
    transform: [{ rotate: '45deg' }],
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#009D66',
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
  },
  loginButton: {
    backgroundColor: '#026A49',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'DM Sans',
    lineHeight: 21.6,
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
    textAlign: 'center',
  },
  signUpRegularText: {
    fontWeight: '400',
    color: '#334155',
  },
  signUpLink: {
    fontWeight: '600',
    color: '#009D66',
  },
});

export default LoginScreen;
