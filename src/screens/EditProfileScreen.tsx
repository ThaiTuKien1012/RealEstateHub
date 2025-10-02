import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useAuth } from '../hooks/useAuth';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateProfile, changePassword, isLoading } = useAuth();

  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user?.gender || 'male');
  const [bio, setBio] = useState(user?.bio || '');
  const [address, setAddress] = useState(user?.address || '');
  
  const [emailNotif, setEmailNotif] = useState(user?.notificationSettings?.email ?? true);
  const [smsNotif, setSmsNotif] = useState(user?.notificationSettings?.sms ?? false);
  const [pushNotif, setPushNotif] = useState(user?.notificationSettings?.push ?? true);
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  ];

  const handleSave = async () => {
    try {
      await updateProfile({
        avatar,
        name,
        email,
        phone,
        dateOfBirth,
        gender,
        bio,
        address,
        notificationSettings: {
          email: emailNotif,
          sms: smsNotif,
          push: pushNotif,
        },
        twoFactorEnabled: twoFactor,
      });
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully!');
      setShowPasswordSection(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <ScrollView>
        <View style={tw`px-4 py-6`}>
          <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>
            Profile Picture
          </Text>
          <View style={tw`bg-white rounded-2xl p-4 mb-6 items-center`}>
            <View style={tw`w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4 overflow-hidden`}>
              {avatar ? (
                <Text style={tw`text-5xl`}>🖼️</Text>
              ) : (
                <Text style={tw`text-5xl text-gray-500`}>◉</Text>
              )}
            </View>
            
            <TouchableOpacity
              onPress={() => setShowAvatarInput(!showAvatarInput)}
              style={tw`bg-yellow-600 px-6 py-2.5 rounded-xl mb-3`}
            >
              <Text style={tw`text-white font-semibold`}>Change Avatar</Text>
            </TouchableOpacity>

            {showAvatarInput && (
              <View style={tw`w-full`}>
                <Text style={tw`text-sm text-gray-600 mb-3`}>Choose an avatar or enter URL:</Text>
                
                <View style={tw`flex-row flex-wrap justify-center gap-3 mb-4`}>
                  {avatarOptions.map((url, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setAvatar(url)}
                      style={[
                        tw`w-16 h-16 rounded-full border-2 items-center justify-center`,
                        avatar === url ? tw`border-yellow-600` : tw`border-gray-200`,
                      ]}
                    >
                      <Text style={tw`text-2xl`}>👤</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-2`}
                  value={avatar}
                  onChangeText={setAvatar}
                  placeholder="Or paste image URL here..."
                  autoCapitalize="none"
                />
                <Text style={tw`text-xs text-gray-500 text-center`}>
                  Supports: JPG, PNG, SVG, GIF
                </Text>
              </View>
            )}
          </View>

          <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>
            Personal Information
          </Text>
          <View style={tw`bg-white rounded-2xl p-4 mb-6`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-2`}>Full Name</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-2`}>Email</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-2`}>Phone Number</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-2`}>Date of Birth</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-2`}>Gender</Text>
              <View style={tw`flex-row gap-2`}>
                {['male', 'female', 'other'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGender(g as any)}
                    style={[
                      tw`flex-1 py-3 rounded-xl border`,
                      gender === g ? tw`bg-yellow-50 border-yellow-600` : tw`bg-gray-50 border-gray-200`,
                    ]}
                  >
                    <Text
                      style={[
                        tw`text-center capitalize`,
                        gender === g ? tw`text-yellow-700 font-semibold` : tw`text-gray-600`,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm text-gray-600 mb-2`}>Bio</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View>
              <Text style={tw`text-sm text-gray-600 mb-2`}>Address</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3`}
                value={address}
                onChangeText={setAddress}
                placeholder="Your address"
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>
            Notification Settings
          </Text>
          <View style={tw`bg-white rounded-2xl overflow-hidden mb-6`}>
            <View style={tw`flex-row items-center justify-between px-4 py-4 border-b border-gray-100`}>
              <Text style={tw`text-gray-900`}>Email Notifications</Text>
              <Switch
                value={emailNotif}
                onValueChange={setEmailNotif}
                trackColor={{ false: '#d1d5db', true: '#fbbf24' }}
                thumbColor={emailNotif ? '#d97706' : '#9ca3af'}
              />
            </View>
            <View style={tw`flex-row items-center justify-between px-4 py-4 border-b border-gray-100`}>
              <Text style={tw`text-gray-900`}>SMS Notifications</Text>
              <Switch
                value={smsNotif}
                onValueChange={setSmsNotif}
                trackColor={{ false: '#d1d5db', true: '#fbbf24' }}
                thumbColor={smsNotif ? '#d97706' : '#9ca3af'}
              />
            </View>
            <View style={tw`flex-row items-center justify-between px-4 py-4`}>
              <Text style={tw`text-gray-900`}>Push Notifications</Text>
              <Switch
                value={pushNotif}
                onValueChange={setPushNotif}
                trackColor={{ false: '#d1d5db', true: '#fbbf24' }}
                thumbColor={pushNotif ? '#d97706' : '#9ca3af'}
              />
            </View>
          </View>

          <Text style={tw`text-xs uppercase tracking-wide text-gray-500 mb-3 px-2`}>
            Security
          </Text>
          <View style={tw`bg-white rounded-2xl overflow-hidden mb-6`}>
            <View style={tw`flex-row items-center justify-between px-4 py-4 border-b border-gray-100`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-gray-900 font-medium`}>Two-Factor Authentication</Text>
                <Text style={tw`text-gray-500 text-xs mt-1`}>Add extra security to your account</Text>
              </View>
              <Switch
                value={twoFactor}
                onValueChange={setTwoFactor}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor={twoFactor ? '#059669' : '#9ca3af'}
              />
            </View>
            <TouchableOpacity
              onPress={() => setShowPasswordSection(!showPasswordSection)}
              style={tw`flex-row items-center justify-between px-4 py-4`}
            >
              <Text style={tw`text-gray-900 font-medium`}>Change Password</Text>
              <Text style={tw`text-gray-400`}>{showPasswordSection ? '▼' : '›'}</Text>
            </TouchableOpacity>

            {showPasswordSection && (
              <View style={tw`px-4 pb-4 border-t border-gray-100 pt-4`}>
                <TextInput
                  style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3`}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Current password"
                  secureTextEntry
                />
                <TextInput
                  style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3`}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  secureTextEntry
                />
                <TextInput
                  style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3`}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                />
                <TouchableOpacity
                  onPress={handleChangePassword}
                  style={tw`bg-yellow-600 py-3 rounded-xl`}
                  disabled={isLoading}
                >
                  <Text style={tw`text-white text-center font-semibold`}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={tw`bg-white border-t border-gray-200 px-4 py-4`}>
        <TouchableOpacity
          onPress={handleSave}
          style={tw`bg-yellow-600 py-4 rounded-xl`}
          disabled={isLoading}
        >
          <Text style={tw`text-white text-center font-bold text-base`}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
