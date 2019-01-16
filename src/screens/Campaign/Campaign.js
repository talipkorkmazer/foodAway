import React, { Component } from "react";
import {
    View,
    Text,
    ScrollView,
    Modal,
    FlatList,
    StyleSheet
} from "react-native";
import { connect } from "react-redux";
import CampaignItem from '../../components/CampaignItem/CampaignItem';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import PlaceList from "../../components/PlaceList/PlaceList";
import { getCampaign, getPlaces, getPlaceDetail } from '../../store/actions/index';

class CampaignScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: "orange"
    };

    componentWillMount() {
        this.reset();
    }
    reset = () => {
        this.setState({
            focusedLocation: {
                latitude: 41.000419,
                longitude: 29.047349
            },
            viewMode: "portrait",
            modalVisible: false,
            selectedCampaign: {
                companyName: "",
                description: "",
                imageUrl: ""
            },
            selectedPlace: {},
            selectedBranchId: null,
        });
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                this.props.onLoadPlaces(this.state.focusedLocation.latitude, this.state.focusedLocation.longitude);
                this.props.onLoadCampaigns();
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

    setModalVisible = (visible, campaignPlace, campaign) => {
        if (!visible) {
            this.setState({
                modalVisible: visible
            })
        } else {
            this.setState({
                modalVisible: visible,
                selectedCampaign: campaign,
                selectedBranchId: campaignPlace.branchId,
                placeDetail: this.props.placeDetail[0]
            })
        }
    }

    useCampaign = () => {

        const selPlace = this.props.places.find(place => {
            return place.id == this.state.selectedBranchId;
        });
        this.props.onLoadPlaceDetail(this.state.selectedBranchId);

        this.props.navigator.push({
            screen: "awesome-places.PlaceDetailScreen",
            title: selPlace.companyName,
            passProps: {
                selectedCampaignId: this.state.selectedCampaign.id,
                selectedPlace: selPlace,
                selectedPlaceId: selPlace.id
            }
        });
        this.setState({
            modalVisible: false
        })
    }

    render() {
        return (
            <ScrollView>
                <FlatList
                    style={styles.listContainer}
                    data={this.props.campaigns.campaignList}
                    renderItem={(info) => (
                        <View style={styles.productCategoryContainer}>
                            <Text style={styles.productCategory}>{info.item.companyName}</Text>
                            <FlatList
                                data={info.item.campaignList}
                                renderItem={(campaign) =>
                                    <CampaignItem
                                        productTitle={campaign.item.companyName}
                                        description={campaign.item.description}
                                        logoUrl={campaign.item.imageUrl}
                                        onItemPressed={() => {
                                            this.setModalVisible(true, info.item, campaign.item);
                                        }}
                                    />
                                }
                            />
                        </View>
                    )}
                />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        //Alert.alert('Modal has been closed.');
                    }}
                >

                    <View style={styles.container}>

                        <CampaignItem
                            productTitle={this.state.selectedCampaign.companyName}
                            description={this.state.selectedCampaign.description}
                            logoUrl={this.state.selectedCampaign.imageUrl}
                        />
                        <View style={styles.buttonContainer}>
                            <ButtonWithBackground
                                color="#29aaf4"
                                styleText={{ color: "#fff" }}
                                onPress={() => {
                                    this.useCampaign();
                                }}>
                                Use Campaign
                    </ButtonWithBackground>
                            <ButtonWithBackground
                                color="#000"
                                styleText={{ color: "#fff" }}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                Kapat
                    </ButtonWithBackground>
                        </View>
                    </View>

                </Modal>
            </ScrollView>

        );
    }
}
const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 450
    },
    container: {
        flex: 3,
        flexDirection: "column"
    },
    portraitContainer: {
        flexDirection: "column"
    },
    landscapeContainer: {
        flexDirection: "row"
    },
    placeDetailContainer: {
        flex: 1
    },
    placeImage: {
        width: 120,
        height: 120,
        alignSelf: 'center'
    },
    placeName: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 28
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    subContainer: {
        flex: 1
    },
    listContainer: {
        marginTop: 50
    },
    productCategoryContainer: {
        marginBottom: 5
    },
    productCategory: {
        fontWeight: "bold",
        fontSize: 16
    },
    placeProductImage: {
        marginRight: 5,
        height: 180,
        width: 180
    },
    productDetailContiner: {
        flexDirection: "row",
        alignItems: "flex-start"
    },
    productDetailMasterContiner: {
        width: "100%",
        margin: 10
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },
    desc: {
        flex: 2,
        width: "35%",
        flexDirection: "column",
        alignItems: "flex-start"
    },
    title: {
        fontWeight: "bold",
        marginBottom: 10
    },
    priceElement: {
        marginRight: 5
    },
    priceText: {
        right: 0,
        position: "absolute",
        marginRight: 30
    }
});
const mapStateToProps = state => {
    return {
        campaigns: state.campaign.campaign,
        places: state.places.places,
        placeDetail: state.placeDetail.placeDetail,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadCampaigns: () => dispatch(getCampaign()),
        onLoadPlaces: (lat, lng) => dispatch(getPlaces(lat, lng)),
        onLoadPlaceDetail: (id) => dispatch(getPlaceDetail(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CampaignScreen);
