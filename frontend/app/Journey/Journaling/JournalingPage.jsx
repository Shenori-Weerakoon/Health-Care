import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../../../components/NavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';


const JournalingPage = () => {
  const [journals, setJournals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment()); 
  const [currentDate, setCurrentDate] = useState(moment().format('Do MMMM, YYYY'));
  const navigation = useNavigation();

  // Fetch user journals from AsyncStorage or API (Simulated here for demo)
  const fetchJournals = async () => {
    try {
      // Simulate fetching journal data
      const storedJournals = await AsyncStorage.getItem('userJournals');
      const parsedJournals = storedJournals ? JSON.parse(storedJournals) : [];
      setJournals(parsedJournals);
    } catch (error) {
      console.log('Error fetching journals', error);
    }
  };

  // Filter journals by the selected date
  const filterJournalsByDate = (date) => {
    return journals.filter(journal => journal.date === date.format('MM/DD/YYYY'));
  };

  // Add new journal (Navigate to the AddJournalPage)
  const addNewJournal = () => {
    navigation.navigate('Journey/Journaling/AddJournalPage');
  };

  // Edit existing journal (Navigate to the EditJournalPage)
  const editJournal = (journalId) => {
    navigation.navigate('EditJournalPage', { journalId });
  };

  useEffect(() => {
    fetchJournals(); // Fetch journals when component mounts
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back and user icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" color="black" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Journaling</Text>
        <TouchableOpacity>
          <Icon name="user" size={30} color="black" style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      {/* Display the current date */}
      <View style={styles.dateContainer}>
        <Text style={styles.currentDate}>{currentDate}</Text>
      </View>

      {/* Calendar-like date selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
        {Array(7)
          .fill(0)
          .map((_, index) => {
            const date = moment().subtract(6 - index, 'days'); // Display past 6 days and today
            const formattedDate = date.format('ddd DD');
            const isToday = date.isSame(moment(), 'day');
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateButton, isToday ? styles.selectedDateButton : null]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={styles.dateText}>{formattedDate}</Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>

      {/* List of journal entries for the selected date */}
      <ScrollView style={styles.journalList}>
        {filterJournalsByDate(selectedDate).map((journal) => (
          <View key={journal.id} style={styles.journalEntry}>
            <Text style={styles.journalDate}>{moment(journal.date, 'MM/DD/YYYY').format('MM/DD')}</Text>
            <View style={styles.journalContent}>
              <Text style={styles.journalText}>{journal.content}</Text>
              <TouchableOpacity onPress={() => editJournal(journal.id)}>
                <Icon name="edit" type="font-awesome" color="black" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating button to add a new journal entry */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('Journey/MoodCheckIn/AddMoodCheckInPage')}>
        <Icon name="plus" color="white" size={30} />
      </TouchableOpacity>

      {/* Nav Bar */}
      <NavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9c8e6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f49fb6',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  currentDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateSelector: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dateButton: {
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    height:50,
  },
  selectedDateButton: {
    backgroundColor: '#d3a4ff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  journalList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  journalEntry: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  journalDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  journalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journalText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#c0392b',
    borderRadius: 50, 
    width: 60,       
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',    
    elevation: 5,
  },  
});

export default JournalingPage;