import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({}); // Track loading per image

  const getAllCars = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars'
      );
      const data = await response.json();
      setCars(data || []);
    } catch (error) {
      console.error('❌ Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoadStart = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageLoadEnd = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    getAllCars()
  },[])

  const renderItem = ({ item }) => {
    const isLoading = imageLoading[item.id];

    return (
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          {isLoading && (
            <ActivityIndicator
              style={StyleSheet.absoluteFill}
              size="small"
              color="#555"
            />
          )}
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onLoadStart={() => handleImageLoadStart(item.id)}
            onLoadEnd={() => handleImageLoadEnd(item.id)}
            onError={() => handleImageLoadEnd(item.id)}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>{item.description}</Text>
          <Text style={styles.type}>Type: {item.carType}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* <Button title="Get All Cars" onPress={getAllCars} /> */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      <FlatList
      horizontal
        data={cars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    marginRight:10,
        width: 100,
    height: 400,
  },
  imageWrapper: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
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

export default CarList;
