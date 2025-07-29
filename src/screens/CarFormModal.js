import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

const CarFormModal = ({ visible, onClose, onSubmit }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [carType, setCarType] = useState('');
  const [tags, setTags] = useState([]);

  const [carTypes, setCarTypes] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    'electric',
    'sedan',
    'luxury',
    'sports',
    'manual',
    'hybrid',
  ]);

  const [loading, setLoading] = useState(false);

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

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSave = () => {
    const newCar = {
      imageUrl,
      name,
      description,
      carType,
      tags,
    };
    onSubmit(newCar);
    onClose();
    setImageUrl('');
    setName('');
    setDescription('');
    setCarType('');
    setTags([]);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add New Car</Text>

        <TextInput
          placeholder="Image URL"
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <TextInput
          placeholder="Car Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Description"
          style={[styles.input, { height: 80 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.sectionTitle}>Select Car Type</Text>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={styles.rowWrap}>
            {carTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  carType === type && styles.selectedOption,
                ]}
                onPress={() => setCarType(type)}
              >
                <Text style={{ color: carType === type ? '#fff' : '#333' }}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Select Tags</Text>
        <View style={styles.rowWrap}>
          {availableTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.optionButton,
                tags.includes(tag) && styles.selectedOption,
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={{ color: tags.includes(tag) ? '#fff' : '#333' }}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onClose} style={[styles.actionBtn, { backgroundColor: '#aaa' }]}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.actionBtn}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#2196F3',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CarFormModal;
