import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../../../components/NavBar';

const EditDailyRoutinePage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { routine, date } = route.params;
  const [selectedDate, setSelectedDate] = useState(date ? moment(date).toDate() : new Date());
  const [morning, setMorning] = useState(routine ? routine.morning.content : '');
  const [day, setDay] = useState(routine ? routine.day.content : '');
  const [evening, setEvening] = useState(routine ? routine.evening.content : '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (routine) {
      setMorning(routine.morning.content || '');
      setDay(routine.day.content || '');
      setEvening(routine.evening.content || '');
    }
  }, [routine]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      const userID = storedUser ? JSON.parse(storedUser).userID : null;
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;

      const updatePayload = {
        originalDate: routine.date,
        morning: { 
          content: morning, 
          status: routine.morning.status === 'pending..' && morning !== routine.morning.content ? 'pending..' : routine.morning.status 
        },
        day: { 
          content: day, 
          status: routine.day.status === 'pending..' && day !== routine.day.content ? 'pending..' : routine.day.status 
        },
        evening: { 
          content: evening, 
          status: routine.evening.status === 'pending..' && evening !== routine.evening.content ? 'pending..' : routine.evening.status 
        },
      };

      const response = await axios.put(`${apiUrl}/daily-routines/${userID}`, updatePayload);

      if (response.status === 200) {
        setIsSaving(false);
        Alert.alert('Success', 'Routine updated successfully');
        navigation.navigate('Journey/DailyRoutine/DailyRoutinePage');
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (error) {
      setIsSaving(false);
      console.log('Error updating routine:', error.response ? error.response.data : error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update routine');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" color="black" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Daily Plan</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{moment(selectedDate).format('MMMM Do YYYY')}</Text>
          </TouchableOpacity>

          {/* Morning Section */}
          <Text style={styles.label}>Morning (Status: {routine.morning.status})</Text>
          <View style={styles.planContainer}>
            <TextInput
              placeholder="Edit morning plan..."
              value={morning}
              onChangeText={setMorning}
              style={styles.input}
              multiline={true}
              editable={routine.morning.status === 'pending..'}
            />
          </View>

          {/* Day Section */}
          <Text style={styles.label}>Day (Status: {routine.day.status})</Text>
          <View style={styles.planContainer}>
            <TextInput
              placeholder="Edit day plan..."
              value={day}
              onChangeText={setDay}
              style={styles.input}
              multiline={true}
              editable={routine.day.status === 'pending..'}
            />
          </View>

          {/* Evening Section */}
          <Text style={styles.label}>Evening (Status: {routine.evening.status})</Text>
          <View style={styles.planContainer}>
            <TextInput
              placeholder="Edit evening plan..."
              value={evening}
              onChangeText={setEvening}
              style={styles.input}
              multiline={true}
              editable={routine.evening.status === 'pending..'}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.navbarContainer}>
        <NavBar />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9c8e6',
  },
  container: { flex: 1, backgroundColor: '#f9c8e6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
    marginLeft: -20,
  },
  datePickerButton: {
    padding: 15,
    backgroundColor: '#6a1b9a',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  datePickerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  scrollContainer: {
    paddingBottom: 300,
    marginTop: 10,
  },
  planContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#b39ddb',
    backgroundColor: '#ce93d8',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    height: 100,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4a148c',
  },
  saveButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    position: 'absolute',
    right: 0,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default EditDailyRoutinePage;