import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const CarDashboardScreen = () => {
  const [carId, setCarId] = useState('');
  const [cars, setCars] = useState([]);
  const [carById, setCarById] = useState(null);
  const [carTypes, setCarTypes] = useState([]);
  const [carTags, setCarTags] = useState([]);
  const [loading, setLoading] = useState({
    cars: false,
    carById: false,
    types: false,
    tags: false,
    imageById: false,
  });
  const [imageLoading, setImageLoading] = useState({});

  const fetchAllCars = async () => {
    setLoading((l) => ({ ...l, cars: true }));
    try {
      const res = await fetch('https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars');
      const data = await res.json();
      setCars(data || []);
    } catch (err) {
      alert('Failed to fetch cars');
    } finally {
      setLoading((l) => ({ ...l, cars: false }));
    }
  };

  const fetchCarById = async () => {
    if (!carId.trim()) return alert('Enter valid ID');
    setLoading((l) => ({ ...l, carById: true }));
    try {
      const res = await fetch(`https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars/${carId}`);
      const data = await res.json();
      setCarById(data);
    } catch (err) {
      alert('Failed to fetch car by ID');
    } finally {
      setLoading((l) => ({ ...l, carById: false }));
    }
  };

  const fetchCarTypes = async () => {
    setLoading((l) => ({ ...l, types: true }));
    try {
      const res = await fetch('https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars/types');
      const data = await res.json();
      setCarTypes(data || []);
    } catch (err) {
      alert('Failed to fetch car types');
    } finally {
      setLoading((l) => ({ ...l, types: false }));
    }
  };

  const fetchCarTags = async () => {
    setLoading((l) => ({ ...l, tags: true }));
    try {
      const res = await fetch('https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars/tags');
      const data = await res.json();
      setCarTags(data || []);
    } catch (err) {
      alert('Failed to fetch car tags');
    } finally {
      setLoading((l) => ({ ...l, tags: false }));
    }
  };

  const handleImageLoad = (id, state) => {
    setImageLoading((prev) => ({ ...prev, [id]: state }));
  };

  const renderCarCard = (item) => (
    <View style={styles.card} key={item.id}>
      <View style={styles.imageWrapper}>
        {imageLoading[item.id] && (
          <ActivityIndicator style={StyleSheet.absoluteFill} size="small" />
        )}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          onLoadStart={() => handleImageLoad(item.id, true)}
          onLoadEnd={() => handleImageLoad(item.id, false)}
          onError={() => handleImageLoad(item.id, false)}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.type}>Type: {item.carType}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🚗 Car Dashboard</Text>

      {/* All Cars */}
      <Text style={styles.section}>All Cars</Text>
      <Button title="Get All Cars" onPress={fetchAllCars} />
      {loading.cars && <ActivityIndicator style={{ marginTop: 10 }} />}
      {cars.map(renderCarCard)}

      {/* Car by ID */}
      <Text style={styles.section}>Search Car by ID</Text>
      <TextInput
        placeholder="Enter Car ID"
        value={carId}
        onChangeText={setCarId}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Get Car" onPress={fetchCarById} />
      {loading.carById && <ActivityIndicator style={{ marginTop: 10 }} />}
      {carById && renderCarCard(carById)}

      {/* Car Types */}
      <Text style={styles.section}>Car Types</Text>
      <Button title="Get All Car Types" onPress={fetchCarTypes} />
      {loading.types && <ActivityIndicator style={{ marginTop: 10 }} />}
      <FlatList
        data={carTypes}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ marginVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{item}</Text>
          </View>
        )}
      />

      {/* Car Tags */}
      <Text style={styles.section}>Car Tags</Text>
      <Button title="Get All Car Tags" onPress={fetchCarTags} />
      {loading.tags && <ActivityIndicator style={{ marginTop: 10 }} />}
      <FlatList
        data={carTags}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ marginVertical: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.pill, { backgroundColor: '#e0f7fa' }]}>
            <Text style={[styles.pillText, { color: '#007c91' }]}>{item}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: '100%', height: '100%' },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  name: { fontWeight: 'bold', fontSize: 16 },
  type: { color: 'gray', marginTop: 4 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#d1e7ff',
    borderRadius: 20,
    marginRight: 10,
  },
  pillText: {
    fontSize: 14,
    color: '#003366',
    fontWeight: '500',
  },
});

export default CarDashboardScreen;
