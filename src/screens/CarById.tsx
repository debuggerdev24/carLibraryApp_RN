import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

const CarById = () => {
  const [carId, setCarId] = useState('');
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const getCarById = async () => {
    if (!carId.trim()) {
      Alert.alert('Please enter a valid Car ID');
      return;
    }

    setLoading(true);
    setCar(null);
    try {
      const response = await fetch(
        `https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars/${carId}`
      );
      const data = await response.json();
      setCar(data);
    } catch (error) {
      console.error('❌ Error fetching car:', error);
      Alert.alert('Failed to fetch car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Enter Car ID"
        value={carId}
        onChangeText={setCarId}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Get Car By ID" onPress={getCarById} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {car && (
        <View style={styles.card}>
          <View style={styles.imageWrapper}>
            {imageLoading && (
              <ActivityIndicator
                style={StyleSheet.absoluteFill}
                size="small"
                color="#555"
              />
            )}
            <Image
              source={{ uri: car.imageUrl }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{car.name}</Text>
            <Text>{car.description}</Text>
            <Text style={styles.type}>Type: {car.carType}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  type: {
    color: 'gray',
    marginTop: 4,
  },
});

export default CarById;
