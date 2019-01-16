import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView from "react-native-maps";
import Icon from 'react-native-vector-icons/Ionicons';

class CustomMarker extends Component {

    state = {
        focusedLocation: {
            latitude: 41.000419,
            longitude: 29.047349,
            latitudeDelta: 0.0122,
            longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
        },
        personLocation: {
            latitude: null,
            longitude: null,
            latitudeDelta: 0.0122,
            longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
        },
        markers: [],
        locationChosen: false
    };

    pickLocationHandler = event => {
        const coords = event.nativeEvent.coordinate;
        this.map.animateToRegion({
            ...this.state.personLocation,
            latitude: coords.latitude,
            longitude: coords.longitude
        });
        this.setState(prevState => {
            return {
                personLocation: {
                    ...prevState.personLocation,
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                locationChosen: true
            }
        });

    };

    getLocationHandler = () => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const coordsEvent = {
                    nativeEvent: {
                        coordinate: {
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        }
                    }
                };
                this.props.onLocateMe(coordsEvent.nativeEvent.coordinate.latitude, coordsEvent.nativeEvent.coordinate.longitude);
                this.pickLocationHandler(coordsEvent);
            },
            err => {
                alert(err);
            }
        )
    };

    render() {
        //alert(JSON.stringify(this.props.places[0]));

        let personLocationMarker = null;
        let allMarkers = null;
        if (this.state.locationChosen) {
            personLocationMarker = (
                <MapView.Marker
                    coordinate={this.state.personLocation}>
                    <View>
                        <Icon name={"ios-walk"} size={35} color="#0000FF" />
                    </View>
                </MapView.Marker>
            );
        }
        allMarkers = this.props.places.map((marker) => {
            return (
                <MapView.Marker
                    title={marker.branchName}
                    description={marker.companyName}
                    coordinate={marker.location}
                    key={marker.key}
                    //onLongPress={(e) => {e.stopPropagation(); this.props.onItemPressed(marker.key)}}
                    onCalloutPress={() => this.props.onItemPressed(marker.key)}

                >
                    <MapView.Callout>
                        <View style={styles.markerContainer}>
                            <Text>{marker.branchName}</Text>
                            <Text>{marker.companyName}</Text>
                        </View>
                    </MapView.Callout>
                </MapView.Marker>
            )
        })
        return (
            <View style={styles.subContainer}>
                <MapView
                    initialRegion={this.state.focusedLocation}
                    style={styles.map}
                    ref={ref => this.map = ref}
                >
                    {
                        allMarkers
                    }
                    {personLocationMarker}
                </MapView>
                <View style={styles.button}>
                    <Button title="Locate Me" onPress={this.getLocationHandler} />
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
        height: 500
    },
    subContainer: {
        //flex: 1,
        width: '100%',
        alignItems: "center"
    },
    button: {
        marginTop: 505
    },
    personMarker: {
        height: 20,
        width: 20
    },
    markerContainer: {
        flex: 1,
        alignItems: "center"
    }
});

export default CustomMarker;
