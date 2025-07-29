import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';

const CarTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const getAllCarTags = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars/tags'
      );
      const data = await response.json();
      setTags(data || []);
    } catch (error) {
      console.error('❌ Error fetching tags:', error);
    //   alert('Failed to fetch car tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
getAllCarTags()
  },[])

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
    <View style={{ flex: 1, padding: 16 }}>
      {/* <Button title="Get All Car Tags" onPress={getAllCarTags} /> */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      <FlatList
              horizontal
              data={tags}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsHorizontalScrollIndicator={false}
            />
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#d1e7ff',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003366',
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

export default CarTags;
