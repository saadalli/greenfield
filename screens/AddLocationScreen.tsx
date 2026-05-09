import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddLocationScreen = () => {
  const [city, setCity] = useState('Islamabad');
  const [area, setArea] = useState('');
  const [sector, setSector] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [propertyType, setPropertyType] = useState<'house' | 'appartment'>('house');
  const [houseNumber, setHouseNumber] = useState('');

  const handleDone = () => {
    // Handle location submission
    const locationData = {
      city,
      area,
      sector,
      streetNumber,
      propertyType,
      houseNumber,
    };
    console.log('Location data:', locationData);
  };

  const handleBack = () => {
    // Navigate back
    console.log('Back pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E84118" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.title}>Add Location</Text>
            <Text style={styles.subtitle}>
              We use your location to show local ads that matter.
            </Text>

            {/* City Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="map-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Islamabad"
                  value={city}
                  onChangeText={setCity}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Area Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Area</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="navigate-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="E.g. Dha"
                  value={area}
                  onChangeText={setArea}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Sector Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sector</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="location-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Dha phase 2"
                  value={sector}
                  onChangeText={setSector}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Street Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Street Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="pin-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. street number 5"
                  value={streetNumber}
                  onChangeText={setStreetNumber}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Property Type Selection */}
            <View style={styles.propertyTypeContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPropertyType('house')}
                activeOpacity={0.7}
              >
                <View style={styles.radioButton}>
                  {propertyType === 'house' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>House</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPropertyType('appartment')}
                activeOpacity={0.7}
              >
                <View style={styles.radioButton}>
                  {propertyType === 'appartment' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Appartment</Text>
              </TouchableOpacity>
            </View>

            {/* House Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>House Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="home-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. House number 5"
                  value={houseNumber}
                  onChangeText={setHouseNumber}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleDone}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E84118',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  formCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  propertyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#0D7F6F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0D7F6F',
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  doneButton: {
    backgroundColor: '#0D7F6F',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#0D7F6F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddLocationScreen;