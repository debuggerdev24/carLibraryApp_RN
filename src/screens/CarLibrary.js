import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Button,
    TextInput,
    Image,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Platform,
    ImageBackground,
    ToastAndroid,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const CarLibrary = () => {
    const [query, setQuery] = useState(null);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState({});
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleFilter, setModalVisibleFilter] = useState(false)
    const [selectedCar, setSelectedCar] = useState(null);
    const [itemForUpdate, setItemForUpdate] = useState(null)
    const { height } = Dimensions.get('window');
    const [filteredCars, setFilteredCars] = useState([]);
    const [isUp, setIsUp] = useState(true);
    const [isUpS, setIsUpS] = useState(true);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [selected, setSelected] = useState(null);
    const [selectedTransmission, setSelectedTransmission] = useState(null);
    const [modalVisibleSort, setModalVisibleSort] = useState(false)
    const [selectedSort, setSelectedSort] = useState(null); // 'az' or 'date'
    const [azAsc, setAzAsc] = useState(true);
    const [dateAsc, setDateAsc] = useState(false);
    const [sortedCars, setSortedCars] = useState([]);
    const [modalVisibleDelete, setModalVisibleDelete] = useState(false)
    const [modalVisibleAddNew, setModalVisibleAddNew] = useState(false)
    const [carName, setCarName] = useState(null)
    const [description, setDescription] = useState('')
    const [selectedType, setSelectedType] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [selectedSpecs, setSelectedSpecs] = useState([]);
    const [carImageUrl, setCarImageUrl] = useState('')
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const cardWidth = (dimensions.width - 40) / 2;
    const formattedTags = selectedTags.map(tag => tag.value);
    const [value, setValue] = useState(null);
    const data = [
        { label: 'Manual', value: 'Manual' },
        { label: 'Automatic', value: 'Automatic' },
    ];

    const Specs = [
        { label: 'Engine: 5.0L Ti-VCT V8', value: 'engine' },
        { label: 'Displacement: 4951 cc', value: 'displacement' },
        { label: 'Fuel Type: Petrol', value: 'fuel' },
        { label: 'Mileage (ARAI): 7.9 km/l', value: 'mileage' },
    ];

    const tagOptions = tags.map(tag => ({
        label: tag.charAt(0).toUpperCase() + tag.slice(1), // Capitalized for display
        value: tag
    }));

    const toggleTag = (tagItem) => {
        setSelectedTags((prev) => {
            const exists = prev.find(t => t.value === tagItem.value);
            if (exists) {
                return prev.filter(t => t.value !== tagItem.value);
            } else {
                return [...prev, tagItem];
            }
        });
    };

    useEffect(() => {
        if (itemForUpdate) {
            setCarName(itemForUpdate.name);
            setDescription(itemForUpdate.description);
            setCarImageUrl(itemForUpdate.imageUrl);

            // ✅ Normalize car type
            const matchedType = data.find(
                (type) => type.value.toLowerCase() === itemForUpdate.carType?.toLowerCase()
            );
            setSelectedType(matchedType?.value || null);

            // ✅ Normalize tags
            if (Array.isArray(itemForUpdate.tags)) {
                const matchedTags = tagOptions.filter(tagOption =>
                    itemForUpdate.tags.includes(tagOption.value)
                );
                setSelectedTags(matchedTags);
            }
        }
    }, [itemForUpdate]);

    const specs = [
        'Engine: 5.0L Ti-VCT V8',
        'Displacement: 4951 cc',
        'Fuel Type: Petrol',
        'Mileage (ARAI): 7.9 km/l',
    ];

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
    }, [])

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

    const handleAddCar = async () => {
        setModalVisibleAddNew(false);

        const payload = {
            imageUrl: carImageUrl,
            name: carName,
            description: description,
            carType: selectedType.toLowerCase(),
            tags: formattedTags,
        };

        console.log('📦 Sending payload:', payload);

        const isUpdate = !!itemForUpdate?.id;
        const method = isUpdate ? 'PATCH' : 'POST';
        const url = isUpdate
            ? `https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars/${itemForUpdate.id}`
            : `https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars`;

        try {
            setLoading(true);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', isUpdate ? 'Car updated successfully!' : 'Car added successfully!');
                setCarName(null);
                setDescription('');
                setSelectedType('');
                setSelectedSpecs([]);
                setCarImageUrl('');
                setSelectedTags([]);
                getAllCars();
            } else {
                Alert.alert('Error', data.message || 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Network Error', 'Failed to save car. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTransmission) {
            const filtered = cars.filter(
                (car) =>
                    car.carType.toLowerCase() === selectedTransmission.toLowerCase()
            );
            setFilteredCars(filtered);
        } else {
            setFilteredCars(cars); // Show all if no filter selected
        }
    }, [selectedTransmission, cars]);


    useEffect(() => {
        getAllCars();
    }, []);

    const toggleSpec = (item) => {
        const exists = selectedSpecs.some((s) => s.value === item.value);

        if (exists) {
            setSelectedSpecs((prev) => prev.filter((s) => s.value !== item.value));
        } else {
            setSelectedSpecs((prev) => [...prev, item]);
        }
    };

    const renderItemDropDownTag = (item) => {
        const exists = selectedTags.some(tag => tag.value === item.value);

        return (
            <TouchableOpacity
                onPress={() => toggleTag(item)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#eee',
                }}
            >
                <View
                    style={{
                        height: 20,
                        width: 20,
                        borderRadius: 2,
                        borderWidth: 1,
                        borderColor: 'black',
                        backgroundColor: exists ? '#ccff00' : '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 10,
                    }}
                >
                    {exists && (
                        <Image
                            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                            source={require('../assets/aquareCheck.png')}
                        />
                    )}
                </View>

                <Text
                    style={{
                        fontSize: 16,
                        color: 'black',
                        textDecorationLine: !exists ? 'underline' : 'none',
                    }}
                >
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    };




    const renderItemDropDown = (item) => {
        const isSelected = selectedType === item.value;

        return (
            <TouchableOpacity
                onPress={() => setSelectedType(item.value)} // Optional: make each item tappable directly
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#eee',
                }}
            >
                <View
                    style={{
                        height: 20,
                        width: 20,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'black',
                        backgroundColor: isSelected ? '#ccff00' : '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 10,
                    }}
                >
                    {isSelected && (
                        <Image
                            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                            source={require('../assets/greenCheck.png')}
                        />
                    )}
                </View>

                <Text
                    style={{
                        fontSize: 16,
                        color: 'black',
                        textDecorationLine: !isSelected ? 'underline' : 'none',
                    }}
                >
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    };

    const handleImageLoadStart = (id) => {
        setImageLoading((prev) => ({ ...prev, [id]: true }));
    };

    const handleImageLoadEnd = (id) => {
        setImageLoading((prev) => ({ ...prev, [id]: false }));
    };

    const handleSortPress = (type) => {
        setModalVisibleSort(false);

        if (type === 'az') {
            if (selectedSort === 'az') {
                setSelectedSort(null);
                setFilteredCars(cars); // Reset to original order
                return;
            }

            const newAzAsc = !azAsc;
            setAzAsc(newAzAsc);
            setSelectedSort('az');

            const sorted = [...cars].sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) return newAzAsc ? -1 : 1;
                if (nameA > nameB) return newAzAsc ? 1 : -1;
                return 0;
            });

            setFilteredCars(sorted);

        } else if (type === 'date') {
            if (selectedSort === 'date') {
                setSelectedSort(null);
                setFilteredCars(cars); // Reset to original order
                return;
            }

            const newDateAsc = !dateAsc;
            setDateAsc(newDateAsc);
            setSelectedSort('date');

            // Add date sort logic here when available
        }
    };


    const toggleSelection = (index) => {
        if (selectedIndices.includes(index)) {
            // Deselect
            setSelectedIndices(selectedIndices.filter((i) => i !== index));
        } else {
            // Select
            setSelectedIndices([...selectedIndices, index]);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://cars-mock-api-new-6e7a623e6570.herokuapp.com/api/cars/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedCars = cars.filter(car => car.id !== id);
                setCars(updatedCars);
                setFilteredCars(updatedCars);
                setModalVisibleDelete(false)
                setModalVisible(false)

                if (Platform.OS === 'android') {
                    setTimeout(() => {
                        ToastAndroid.show('Car deleted successfully!', ToastAndroid.SHORT);
                    }, 1000);
                }
            } else {
                console.error('Failed to delete:', response.status);
                ToastAndroid.show('Failed to delete the car', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            ToastAndroid.show('Error deleting car', ToastAndroid.SHORT);
        }
    };



    const handleSearch = (text) => {
        const filtered = cars.filter((car) =>
            car.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCars(filtered);
    };


    const renderItem = ({ item }) => {
        const isLoading = imageLoading[item.id];

        return (
            <TouchableOpacity onLongPress={() => { setItemForUpdate(item), setModalVisibleAddNew(true) }} onPress={() => {
                setSelectedCar(item);
                setModalVisible(true);
            }} style={[styles.imageWrapper, { width: cardWidth }]}>
                {isLoading && (
                    <ActivityIndicator
                        style={StyleSheet.absoluteFill}
                        size="small"
                        color="#555"
                    />
                )}
                <ImageBackground
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoadStart={() => handleImageLoadStart(item.id)}
                    onLoadEnd={() => handleImageLoadEnd(item.id)}
                    onError={() => handleImageLoadEnd(item.id)}
                >
                    <View style={{ width: 100, alignSelf: "flex-end", marginRight: 10, marginTop: 10, borderRadius: 15, height: 30, justifyContent: "center", alignItems: "center", backgroundColor: item.carType === 'manual' ? "#D6F9DB" : "#F5E7D0" }}>

                        <Text style={{ color: item?.carType === 'manual' ? '#10A024' : '#997C4C' }} >{item?.carType}</Text>
                    </View>
                    <View style={{ width: '100%', marginTop: "auto", marginBottom: 10, marginLeft: 10, borderRadius: 15, height: 30, justifyContent: "center", }}>

                        <Text style={{ color: "white", fontSize: 16 }} >{item?.name}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Header with New Car button */}
            <TouchableOpacity onPress={() => setModalVisibleAddNew(true)} style={styles.newCarButton}>
                <Text style={styles.newCarButtonText}>+ New Car</Text>
            </TouchableOpacity>

            {/* Search and filter row */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Image
                        source={require('../assets/search.png')}
                        style={styles.icon}
                    />
                    <TextInput
                        value={query}
                        onChangeText={(text) => {
                            setQuery(text);
                            handleSearch(text);
                        }}
                        placeholder="Search"
                        placeholderTextColor="gray"
                        style={styles.searchInput}
                    />
                </View>

            <View style={styles.filterIconsContainer}>
                       {!query ?  <>
                    <TouchableOpacity onPress={() => setModalVisibleSort(true)} >
                        <Image
                            source={require('../assets/sort.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisibleFilter(true)} >
                        <Image
                            source={require('../assets/filter.png')}
                            style={[styles.icon, styles.filterIcon]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/check.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
</>
                    : <TouchableOpacity onPress={() => setQuery('')} >
                    <Text style={{color:"red", fontSize:16}} >Cancel</Text>
                </TouchableOpacity>
}
                </View>
                
            </View>

            {/* Main content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={filteredCars}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={query && filteredCars.length === 0 ? styles.listContent1 : styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Image style={{ width: 160, height: 120 }} source={(require('../assets/empty.png'))} />
                            <Text style={{ marginTop: 25, fontSize: 16, fontWeight: '700', color: "gray" }}>No results found with {query}.</Text>
                        </View>
                    }
                />
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            borderRadius: 10,
                            padding: 15,
                        }}
                    >
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', marginTop: 25 }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Image
                                source={require('../assets/close.png')}
                                style={{ width: 20, height: 20 }}
                            />
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedCar && (
                                <>
                                    <Text style={{ fontSize: 26, fontWeight: 'bold', marginTop: 20 }}>
                                        {selectedCar.name}
                                    </Text>

                                    <Image
                                        source={{ uri: selectedCar.imageUrl }}
                                        style={{
                                            width: '100%',
                                            marginTop: 15,
                                            height: height * 0.25,
                                            borderRadius: 10,
                                        }}
                                        resizeMode="cover"
                                    />

                                    <View
                                        style={{
                                            paddingVertical: 6,
                                            paddingHorizontal: 12,
                                            marginTop: 25,
                                            backgroundColor: 'lightgreen',
                                            alignSelf: 'flex-start',
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Text>{selectedCar?.carType}</Text>
                                    </View>

                                    <View style={{ alignSelf: 'flex-start', marginTop: 25 }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>DESCRIPTION</Text>
                                        <Text style={{ fontSize: 14, marginTop: 5, color: 'black' }}>
                                            {selectedCar.description}
                                        </Text>
                                    </View>

                                    <View style={{ marginTop: 25 }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                                            SPECIFICATIONS
                                        </Text>

                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                                            <View
                                                style={{
                                                    borderColor: 'purple',
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    paddingVertical: 6,
                                                    paddingHorizontal: 12,
                                                    marginRight: 10,
                                                    marginBottom: 10,
                                                }}
                                            >
                                                <Text style={{ fontSize: 14, color: 'black' }}>
                                                    Engine: 5.0L Ti-VCT V8
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    borderColor: 'purple',
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    paddingVertical: 6,
                                                    paddingHorizontal: 12,
                                                    marginRight: 10,
                                                    marginBottom: 10,
                                                }}
                                            >
                                                <Text style={{ fontSize: 14, color: 'black' }}>
                                                    Displacement: 4951 cc
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    borderColor: 'purple',
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    paddingVertical: 6,
                                                    paddingHorizontal: 12,
                                                    marginRight: 10,
                                                    marginBottom: 10,
                                                }}
                                            >
                                                <Text style={{ fontSize: 14, color: 'black' }}>Fuel Type: Petrol</Text>
                                            </View>

                                            <View
                                                style={{
                                                    borderColor: 'purple',
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    paddingVertical: 6,
                                                    paddingHorizontal: 12,
                                                    marginRight: 10,
                                                    marginBottom: 10,
                                                }}
                                            >
                                                <Text style={{ fontSize: 14, color: 'black' }}>
                                                    Mileage (ARAI): 7.9 km/l
                                                </Text>
                                            </View>
                                        </View>
                                    </View>


                                    <View
                                        style={{
                                            marginTop: 25,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, color: 'gray' }}>
                                            Last updated: Feb 05, 2025
                                        </Text>
                                        <TouchableOpacity onPress={() => setModalVisibleDelete(true)} >
                                            <Image
                                                source={require('../assets/delete.png')}
                                                style={{ width: 18, height: 18 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleFilter}
                onRequestClose={() => setModalVisibleFilter(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: '80%',
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 15,
                        }}
                    >

                        <View style={{ marginTop: 30, flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }} >
                            <Text style={{ fontSize: 24, fontWeight: '700', color: "black" }} >Filter By</Text>
                            {(selectedIndices.length > 0 || selected) && <TouchableOpacity onPress={() => { setSelected(null), setSelectedIndices([]) }} style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }} >
                                <Image
                                    style={{
                                        width: 16,
                                        height: 16,
                                        transform: [{ rotate: isUpS ? '0deg' : '180deg' }],
                                    }}
                                    source={require('../assets/Reset.png')}
                                />
                                <Text style={{ fontSize: 14, fontWeight: '600', color: "black", marginLeft: 10 }} >Reset</Text>
                            </TouchableOpacity>}
                        </View>
                        <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
                            <Text style={{ fontSize: 14, fontWeight: '800', color: "black" }} >Car Type</Text>
                            <TouchableOpacity onPress={() => setIsUp(!isUp)}>
                                <Image
                                    style={{
                                        width: 13,
                                        height: 8,
                                        transform: [{ rotate: isUp ? '0deg' : '180deg' }],
                                    }}
                                    source={require('../assets/ArrowUp.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        {isUp && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={() => setSelected('manual')}
                                    style={{
                                        marginLeft: 5,
                                        paddingHorizontal: 16,
                                        paddingVertical: 6,
                                        backgroundColor: selected === 'manual' ? 'purple' : '#0000000A',
                                        borderRadius: 36,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: selected === 'manual' ? 'white' : 'black' }}>Manual</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setSelected('automatic')}
                                    style={{
                                        marginLeft: 10,
                                        paddingHorizontal: 16,
                                        paddingVertical: 6,
                                        backgroundColor: selected === 'automatic' ? 'purple' : '#0000000A',
                                        borderRadius: 36,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: selected === 'automatic' ? 'white' : 'black' }}>Automatic</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
                            <Text style={{ fontSize: 14, fontWeight: '800', color: "black" }} >SPECIFICATIONS</Text>
                            <TouchableOpacity onPress={() => setIsUpS(!isUpS)}>
                                <Image
                                    style={{
                                        width: 13,
                                        height: 8,
                                        transform: [{ rotate: isUpS ? '0deg' : '180deg' }],
                                    }}
                                    source={require('../assets/ArrowUp.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 15 }}>
                            {specs.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => toggleSelection(index)}
                                    style={{
                                        borderColor: '#0000000A',
                                        borderWidth: 0.5,
                                        borderRadius: 8,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        marginRight: 10,
                                        marginBottom: 10,
                                        backgroundColor: "#9B72D21A"
                                    }}
                                >
                                    <Text style={{ fontSize: 14, color: selectedIndices.includes(index) ? '#9B72D2' : 'black', fontWeight: "400" }}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={() => { setSelectedTransmission(selected), setModalVisibleFilter(false) }}
                            style={{
                                marginTop: 'auto',
                                backgroundColor: '#9B72D2',
                                paddingVertical: 10,
                                alignItems: 'center',
                                borderRadius: 100,
                                width: 201,
                                height: 56,
                                justifyContent: "center",
                                alignSelf: "center",
                                marginBottom: 25
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 16 }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleSort}
                onRequestClose={() => setModalVisibleSort(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: '30%',
                            backgroundColor: 'white',
                            borderRadius: 10,
                            padding: 15,
                        }}
                    >
                        <TouchableOpacity onPress={() => handleSortPress('az')} style={{ marginTop: 25, flexDirection: 'row', alignItems: "center" }} >
                            <Text style={{ fontWeight: "600", fontSize: 16, color: selectedSort === 'az' ? '#9B72D2' : 'black', }} >Sort by A - Z</Text>
                            <Image
                                tintColor={selectedSort === 'az' ? '#9B72D2' : null}
                                source={require('../assets/SortingDown.png')}
                                style={{ width: 7, height: 14, marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSortPress('date')} style={{ marginTop: 25, flexDirection: 'row', alignItems: "center" }} >
                            <Text style={{ fontWeight: "600", fontSize: 16, color: selectedSort === 'date' ? '#9B72D2' : 'black', }} >Sort by Date Modified</Text>
                            <Image
                                tintColor={selectedSort === 'date' ? '#9B72D2' : null}
                                source={require('../assets/SortingDown.png')}
                                style={{ width: 7, height: 14, marginLeft: 10, transform: [{ rotate: '180deg' }], }}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDelete}
                onRequestClose={() => setModalVisibleDelete(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        padding: 20
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: '30%',
                            backgroundColor: 'white',
                            borderRadius: 24,
                            padding: 15,
                        }}
                    >
                        <View style={{ width: 20, height: 20, alignSelf: "center", marginTop: 20 }} >
                            <Image
                                source={require('../assets/delete.png')}
                                style={{ width: 18, height: 18 }}
                            />
                        </View>
                        <View style={{ alignSelf: "center", marginTop: 20 }} >
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: "700", textAlign: "center" }} >Delete Delete Toyota Corolla??</Text>
                            <Text style={{ fontSize: 14, color: 'black', fontWeight: "400", textAlign: "center" }} >Are you sure you want to delete this Car?</Text>
                        </View>
                        <View style={{ alignSelf: "center", width: 260, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 }} >
                            <TouchableOpacity onPress={() => setModalVisibleDelete(false)} style={{ width: 124, height: 56, borderWidth: 1, borderColor: "black", borderRadius: 100, justifyContent: "center", alignItems: "center" }} >
                                <Text style={{ fontSize: 14, fontWeight: '700', color: "black" }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(selectedCar?.id)} style={{ width: 124, height: 56, borderWidth: 1, borderColor: "black", borderRadius: 100, justifyContent: "center", alignItems: "center", backgroundColor: "black" }} >
                                <Text style={{ fontSize: 14, fontWeight: '700', color: "white" }} >Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleAddNew}
                onRequestClose={() => setModalVisibleAddNew(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        // padding:20
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            // borderRadius: 24,
                            padding: 15,
                        }}
                    >
                        <View style={{ alignSelf: 'center', marginTop: 50 }} >
                            <Text style={{ fontSize: 24, fontWeight: '700', color: "black" }} >Add Car</Text>
                        </View>

                        <View style={{ marginTop: 50, }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '700',
                                color: 'black',
                                marginBottom: 6,
                            }}>
                                Car name <Text style={{ color: "red" }}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter car name"
                                placeholderTextColor="#C0C0C0"
                                value={carName}
                                onChangeText={setCarName}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                    color: 'black',
                                    marginBottom: 6
                                }}>
                                    Description
                                </Text>
                                <Text style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: '#000000',
                                    marginBottom: 6
                                }}>
                                    {description.length}/250 char
                                </Text>
                            </View>

                            <TextInput
                                multiline
                                maxLength={250}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Enter here"
                                placeholderTextColor="#C0C0C0"
                                style={{
                                    height: 126,
                                    borderRadius: 25,
                                    borderWidth: 1,
                                    borderColor: '#E5E5E5',
                                    paddingHorizontal: 20,
                                    paddingTop: 12,
                                    paddingBottom: 12,
                                    fontSize: 16,
                                    backgroundColor: '#FFFFFF',
                                    textAlignVertical: 'top'
                                }}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'black', marginBottom: 6 }}>
                                Car type <Text style={{ color: 'red' }}>*</Text>
                            </Text>

                            <Dropdown
                                style={{
                                    height: 50,
                                    borderColor: '#E5E5E5',
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    paddingHorizontal: 20,
                                    backgroundColor: '#fff',
                                }}
                                placeholderStyle={{ fontSize: 16, color: '#C0C0C0' }}
                                selectedTextStyle={{ fontSize: 16, color: '#000' }}
                                iconStyle={{ width: 20, height: 20 }}
                                data={data}
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder="Select"
                                value={selectedType}
                                onChange={item => {
                                    setSelectedType(item.value); // ✅ correct variable
                                }}
                                renderItem={renderItemDropDown}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'black', marginBottom: 6 }}>
                                Specifications <Text style={{ color: 'red' }}>*</Text>
                            </Text>

                            <Dropdown
                                style={{
                                    height: 50,
                                    borderColor: '#E5E5E5',
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    paddingHorizontal: 20,
                                    backgroundColor: '#fff',
                                }}
                                placeholderStyle={{ fontSize: 16, color: '#C0C0C0' }}
                                selectedTextStyle={{ fontSize: 16, color: '#000' }}
                                iconStyle={{ width: 20, height: 20 }}
                                data={tagOptions}
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Tag"
                                value={null} // always null for multi-select
                                onChange={() => { }} // handled in renderItem
                                renderItem={renderItemDropDownTag}
                            />

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                {selectedTags.map((item) => (
                                    <View
                                        key={item.value}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                            paddingVertical: 6,
                                            paddingHorizontal: 10,
                                            marginRight: 10,
                                            marginBottom: 10,
                                            backgroundColor: '#9B72D21A',
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, color: 'black', marginRight: 6 }}>
                                            {item.label}
                                        </Text>
                                        <TouchableOpacity onPress={() => toggleTag(item)}>
                                            <Image style={{ width: 8, height: 8 }} source={require('../assets/close.png')} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={{ marginTop: 20, }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '700',
                                color: 'black',
                                marginBottom: 6,
                            }}>
                                Car Image URL <Text style={{ color: "red" }}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter here"
                                placeholderTextColor="#C0C0C0"
                                value={carImageUrl}
                                onChangeText={setCarImageUrl}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => handleAddCar()}
                            style={{
                                marginTop: 'auto',
                                backgroundColor: '#9B72D2',
                                paddingVertical: 10,
                                alignItems: 'center',
                                borderRadius: 100,
                                width: 201,
                                height: 56,
                                justifyContent: "center",
                                alignSelf: "center",
                                marginBottom: 10
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 16 }}>Add</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    headerContainer: {
    },
    newCarButton: {
        alignSelf: 'flex-end',
        marginBottom: 15,
        backgroundColor: "purple",
        width: 100,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    newCarButtonText: {
        color: "white",
        fontSize: 14,
    },
    searchContainer: {
        width: "100%",
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20
    },
    searchInputContainer: {
        width: '65%',
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 8 : 5,
        borderRadius: 30,
        backgroundColor: 'lightgray',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        fontSize: 16,
        marginLeft: 5,
        flex: 1,
        paddingVertical: Platform.OS === 'ios' ? 2 : 0,
    },
    filterIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '30%',
    },
    icon: {
        width: 18,
        height: 18,
    },
    filterIcon: {
        marginHorizontal: 5,
    },
    listContent: {
        paddingVertical: 8,
    },
    listContent1: {
        flexGrow: 1,
        justifyContent: 'center', // center vertically
        alignItems: 'center',     // center horizontally
        paddingVertical: 8,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    imageWrapper: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        marginBottom: 10,
        borderRadius: 20,
        overflow: "hidden"
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    input: {
        height: 56,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: 20,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    }

});

export default CarLibrary;
