import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export interface LoginFormProps {
  onLoginSubmit: (identifier: string, password: string) => void;
  onForgotPassword?: () => void;
  onClearError?: () => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({
  onLoginSubmit,
  onForgotPassword,
  onClearError,
  loading = false,
  error = null,
}: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Only highlight input fields red for local validation errors, not server errors
  const hasValidationError = Boolean(validationError);
  const hasAnyError = Boolean(validationError || error);

  const handleSubmit = () => {
    if (!identifier.trim()) {
      setValidationError('Please enter your mobile number, username, or email');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    setValidationError(null);
    onLoginSubmit(identifier.trim(), password.trim());
  };

  const handleIdentifierChange = (val: string) => {
    setIdentifier(val);
    if (validationError) setValidationError(null);
    if (error && onClearError) onClearError();
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (validationError) setValidationError(null);
    if (error && onClearError) onClearError();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/login-bg.png')}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Hospital Branding Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../../assets/hospital-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue to your field dashboard
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formContainer}>
            {/* Input 1: Identifier */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Mobile Number / Username / Email
              </Text>
              <View style={[styles.inputWrapper, hasValidationError && styles.inputWrapperError]}>
                <Feather
                  name="user"
                  size={20}
                  color={hasValidationError ? '#EF4444' : '#5E718D'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter mobile, username or email"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  value={identifier}
                  onChangeText={handleIdentifierChange}
                />
              </View>
            </View>

            {/* Input 2: Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, hasValidationError && styles.inputWrapperError]}>
                <Feather
                  name="lock"
                  size={20}
                  color={hasValidationError ? '#EF4444' : '#5E718D'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Toggle password visibility"
                  activeOpacity={0.7}
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={hasValidationError ? '#EF4444' : '#5E718D'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              activeOpacity={0.7}
              onPress={onForgotPassword}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Gentle notice banner — no scary red */}
            {hasAnyError && (
              <View style={styles.noticeBanner}>
                <Ionicons name="information-circle-outline" size={20} color="#B45309" style={styles.noticeIcon} />
                <Text style={styles.noticeBannerText}>
                  {validationError || error}
                </Text>
              </View>
            )}

            {/* Primary Sign In Button with Arrow Circle Badge */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleSubmit}
              style={[styles.signInButton, loading && styles.buttonDisabled]}
            >
              <View style={styles.buttonEmptyLeft} />
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
              <View style={styles.arrowCircle}>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer Security Badge */}
          <View style={styles.footerContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#0FB5AE"
              style={styles.shieldIcon}
            />
            <View style={styles.footerDivider} />
            <Text style={styles.footerText}>
              Secure access for authorized field agents
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FD',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 52 : 46,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  logo: {
    width: 205,
    height: 112,
  },
  headerTextContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0D2646',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5E718D',
    lineHeight: 20,
    fontWeight: '400',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#D4E2F4',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    shadowColor: '#0F6FDE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FFFBFB',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0F172A',
  },
  eyeButton: {
    padding: 6,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -2,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F6FDE',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  noticeIcon: {
    marginRight: 8,
  },
  noticeBannerText: {
    flex: 1,
    color: '#92400E',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  signInButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0E70E3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 8,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonEmptyLeft: {
    width: 36,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0FB5AE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  shieldIcon: {
    marginRight: 8,
  },
  footerDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginRight: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});
