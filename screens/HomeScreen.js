import { View, Text, SafeAreaView, Image, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@react-navigation/native';
import { theme } from '../theme';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid'
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import { recomendations, weatherImages } from '../constants';


export default function HomeScreen () {

    const [ showSearch, toggleSearch ] = useState(false);
    const [ locations, setLocations ] = useState([]);
    const [ weather, setWeather ] = useState({});
    
    const handleLocation = ( loc ) => {
        console.log('location', loc);
        setLocations([]);
        toggleSearch(false);
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setWeather(data);
            console.log('got forecast: ', data);
        });
    }

    const handleSearch = value => {
        if(value.length > 2)
        {
            fetchLocations({ cityName: value }).then(data => {
                setLocations(data);
            })
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

    const { current, location } = weather;

    return (
        <View className = "flex-1 relative">
            <StatusBar style = "light" />
            <Image
                blurRadius={70} 
                source = { require('../assets/images/bg.png') } 
                className = "absolute h-full w-full"
            />
            <SafeAreaView className = 'flex flex-1'>
                <View
                    style = {{height: '7%'}}
                    className = "mx-4 relative z-50"
                >
                    <View
                        className = "flex-row justify-end items-center rounded-full"
                        style = {{backgroundColor: showSearch? theme.bgWhite(0.2): 'transparent'}}
                    >
                        {
                            showSearch? (
                                <TextInput 
                                    onChangeText = { handleTextDebounce }
                                    placeholder = "Buscar ciudad"
                                    placeholderTextColor = { "lightgray" }
                                    className = "pl-6 h-10 flex-1 text-base text-white"
                                />
                            ):null
                        }
                        
                        <TouchableOpacity
                            onPress = { () => toggleSearch(!showSearch)}
                            style = {{ backgroundColor: theme.bgWhite(0.3)}}
                            className = "rounded-full p-3 m-1"
                        >
                            <MagnifyingGlassIcon size = "25" color = "white" />
                        </TouchableOpacity>
                    </View>
                    {
                        locations.length > 0 && showSearch? (
                            <View className = "absolute w-full bg-gray-300 top-16 rounded-3xl">
                                {
                                    locations.map(( loc, index ) => {
                                        let showBorder = index + 1 != locations.length;
                                        let borderClass = showBorder? 'border-b-b2 border-b-gray-400' : '';
                                        return (
                                            <TouchableOpacity
                                                onPress = { () => handleLocation(loc) }
                                                key = { index }
                                                className = {"flex-row items-center border-0 p-3 px-4 mb1" + borderClass}
                                            >
                                                <MapPinIcon size = "20" color = "gray"/>
                                                <Text className = "text-black text-lg ml-2" >{ loc?.name }, { loc?.country } </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        ):null
                    }
                </View>
                <View
                    className = "mx-4 flex justify-around flex-1 mb-2"
                >
                    <Text
                        className = "text-white text-center text-2xl font-bold"
                    >
                        {location?.name},
                        <Text
                            className = "text-lg font-semibold text-gray-300"
                        >
                            {" " + location?.country}
                        </Text>
                    </Text>
                    <View
                        className = "flex-row justify-center "
                    >
                        <Image 
                            source = { weatherImages[current?.condition.text || 'other'] }
                            className = "w-52 h-52"
                        />
                    </View>
                    <View
                        className = "space-y-2"
                    >
                        <Text
                            className = "text-center font-bold text-white text-6xl ml-5"
                        >
                            {current?.temp_c}&#176;
                        </Text>
                        <Text
                            className = "text-center font-bold text-white text-xl tracking-widest"
                        >
                            {current?.condition?.text}
                        </Text>
                    </View>
                    <View
                        className = "flex-row justify-between mx-4"
                    >
                        <View
                            className = "flex-row space-x-2 items-center"
                        >
                            <Image 
                                source = { require('../assets/icons/wind.png') }
                                className = "h-6 w-6"
                            />
                            <Text
                                className = "text-white font-semibold text-base"
                            >
                                {current?.wind_kph}km
                            </Text>
                        </View>
                        <View
                            className = "flex-row space-x-2 items-center"
                        >
                            <Image 
                                source = { require('../assets/icons/drop.png') }
                                className = "h-6 w-6"
                            />
                            <Text
                                className = "text-white font-semibold text-base"
                            >
                                {current?.humidity}%
                            </Text>
                        </View>
                        <View
                            className = "flex-row space-x-2 items-center"
                        >
                            <Image 
                                source = { require('../assets/icons/sun.png') }
                                className = "h-6 w-6"
                            />
                            <Text
                                className = "text-white font-semibold text-base"
                            >
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    className = "mb-2 space-y-3"
                >
                    <View
                        className = "flex-row items-center mx-5 space-x-2"
                    >
                        <CalendarDaysIcon size = "22" color = "white" />
                        <Text
                            className = "text-white text-base"
                        >
                            Pronóstico diario
                        </Text>
                    </View>
                    <ScrollView
                        horizontal
                        contentContainerStyle = {{ paddingHorizontal: 15 }}
                        showsHorizontalScrollIndicator = { false }
                    >
                        {
                            weather?.forecast?.forecastday?.map((item, index) => {
                                const date = new Date(item.date);
                                const options = { weekday: "long" };
                                let dayName = date.toLocaleDateString("es-Es", options);
                                dayName = dayName.split(",")[0];
                
                                return (
                                  <View
                                    key={index}
                                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                                  >
                                    <Image
                                      source={
                                        weatherImages[item?.day?.condition?.text || "other"]
                                      }
                                      className="w-11 h-11"
                                    />
                                    <Text className="text-white">{dayName}</Text>
                                    <Text className="text-white text-xl font-semibold">
                                      {item?.day?.avgtemp_c}&#176;
                                    </Text>
                                  </View>
                                );
                              })
                        }
                    </ScrollView>

                    <Text
                            className = "text-white text-base"
                        >
                            Recomendamos usar
                        </Text>
                    <ScrollView
                        horizontal
                        contentContainerStyle = {{ paddingHorizontal: 15 }}
                        showsHorizontalScrollIndicator = { false }
                    >
                        <View
                            className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                            style={{ backgroundColor: theme.bgWhite(0.15) }}
                        >
                            <Image
                                source = { require('../assets/images/sunny1.png') } 
                                className="w-11 h-11"
                            />
                            <Text className="text-white">Isdin</Text>
                            <Text className="text-white text-xl font-semibold">
                                Protector Solar
                            </Text>
                        </View>
                        <View
                            className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                            style={{ backgroundColor: theme.bgWhite(0.15) }}
                        >
                            <Image
                                source = { require('../assets/images/sunny2.png') } 
                                className="w-11 h-11"
                            />
                            <Text className="text-white text-xl font-semibold">
                                Gorra o sombrero
                            </Text>
                        </View>
                        <View
                            className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                            style={{ backgroundColor: theme.bgWhite(0.15) }}
                        >
                            <Image
                                source = { require('../assets/images/sunny3.png') } 
                                className="w-11 h-11"
                            />
                            <Text className="text-white text-xl font-semibold">
                                Sombrilla
                            </Text>
                        </View>
                        <View
                            className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                            style={{ backgroundColor: theme.bgWhite(0.15) }}
                        >
                            <Image
                                source = { require('../assets/images/sun.png') } 
                                className="w-11 h-11"
                            />
                            <Text className="text-white font-semibold">
                                No exponerse al sol por tiempo prolongado
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    )
}