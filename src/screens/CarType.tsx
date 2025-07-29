import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';

const CarTypes = () => {
  const [carTypes, setCarTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const getAllCarTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars/types'
      );
      const data = await response.json();
      setCarTypes(data || []);
    } catch (error) {
      console.error('❌ Error fetching car types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCarTypes();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      style={[
        styles.buttonCard,
        item === selectedType && styles.selectedCard,
      ]}
      onPress={() => setSelectedType(item)}
    >
      <Text
        style={[
          styles.typeText,
          item === selectedType && styles.selectedText,
        ]}
      >
        {item}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>

      {loading && <ActivityIndicator size="large" color="#000" />}

      <FlatList
        horizontal
        data={carTypes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingVertical: 10,
  },
  buttonCard: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height:50
  },
  selectedCard: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    height:50
  },
  typeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  selectionText: {
    marginTop: 20,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default CarTypes;
