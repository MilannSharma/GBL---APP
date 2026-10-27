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
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({
  onLoginSubmit,
  onForgotPassword,
  onGoogleSignIn,
  onAppleSignIn,
  loading = false,
  error = null,
}: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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
              <View style={styles.inputWrapper}>
                <Feather
                  name="user"
                  size={20}
                  color="#5E718D"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter mobile, username or email"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  value={identifier}
                  onChangeText={(val) => {
                    setIdentifier(val);
                    if (validationError) setValidationError(null);
                  }}
                />
              </View>
            </View>

            {/* Input 2: Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name="lock"
                  size={20}
                  color="#5E718D"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (validationError) setValidationError(null);
                  }}
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
                    color="#5E718D"
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

            {/* Validation / API Error */}
            {(validationError || error) && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={18} color="#D93025" />
                <Text style={styles.errorBannerText}>
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

            {/* Divider: or continue with */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            {/* Continue with Google */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              activeOpacity={0.8}
              onPress={onGoogleSignIn}
              style={styles.socialButton}
            >
              <View style={styles.socialIconContainer}>
                <Ionicons name="logo-google" size={20} color="#EA4335" />
              </View>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Continue with Apple */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              activeOpacity={0.8}
              onPress={onAppleSignIn}
              style={styles.socialButton}
            >
              <View style={styles.socialIconContainer}>
                <Ionicons name="logo-apple" size={22} color="#000000" />
              </View>
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorBannerText: {
    color: '#D93025',
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDE7F3',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    color: '#7C8BA0',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#D4E2F4',
    height: 48,
    borderRadius: 24,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  socialIconContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
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
