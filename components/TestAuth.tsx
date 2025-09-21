import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { registerWithEmail, loginWithEmail } from '@/services/appwrite';

export const TestAuth = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (isRegistering) {
        if (!name) {
          Alert.alert('Error', 'Please enter your name');
          return;
        }
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    }
  };

  return (
    <View className="w-full px-4">
      <Text className="text-white text-lg font-bold mb-4">
        {isRegistering ? 'Create Account' : 'Sign In with Email'}
      </Text>
      
      {isRegistering && (
        <TextInput
          className="bg-gray-800 text-white p-3 rounded-lg mb-3"
          placeholder="Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
        />
      )}
      
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-3"
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-4"
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        className="bg-red-600 p-3 rounded-lg mb-3"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">
          {isRegistering ? 'Create Account' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setIsRegistering(!isRegistering)}
      >
        <Text className="text-gray-400 text-center">
          {isRegistering 
            ? 'Already have an account? Sign In' 
            : "Don't have an account? Create one"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};