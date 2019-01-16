import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated
} from "react-native";
import { connect } from "react-redux";
import MapView from "react-native-maps";

import PlaceList from "../../components/PlaceList/PlaceList";
import TabBar from '../../components/TabBar/TabBar';
import { getPlaces, getPlaceDetail } from '../../store/actions/index';

class FindPlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: "orange"
    };

    state = {
        focusedLocation: {
            latitude: 41.000419,
            longitude: 29.047349
        },
        placesLoaded: false,
        removeAnim: new Animated.Value(1),
        placesAnim: new Animated.Value(0)
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                this.props.onLoadPlaces(this.state.focusedLocation.latitude, this.state.focusedLocation.longitude);
                this.props.onLoadPlaceDetail('5c34ce5b774bfd0cdaab93fb');
                console.disableYellowBox = true;
            }
        }
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    }

    placesLoadedHandler = () => {
        Animated.timing(this.state.placesAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    };

    placesSearchHandler = () => {
        Animated.timing(this.state.removeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                placesLoaded: true
            });
            this.placesLoadedHandler();
        });
    };

    itemSelectedHandler = key => {
        const selPlace = this.props.places.find(place => {
            return place.key === key;
        });
        this.props.onLoadPlaceDetail(selPlace.id);
        this.props.navigator.push({
            screen: "awesome-places.PlaceDetailScreen",
            title: selPlace.companyName,
            passProps: {
                selectedPlace: selPlace,
                selectedPlaceId: selPlace.id,
                placeDetail: this.props.placeDetail[0]
            }
        });
    };

    onLocateMe = (lat, lng) => {
        this.props.onLoadPlaces(lat, lng);
    }

    render() {
        return (
            <TabBar
                places={this.props.places}
                onItemSelected={this.itemSelectedHandler}
                onLocateMe={this.onLocateMe}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        places: state.places.places,
        placeDetail: state.placeDetail.placeDetail,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadPlaces: (lat, lng) => dispatch(getPlaces(lat, lng)),
        onLoadPlaceDetail: (id) => dispatch(getPlaceDetail(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);
