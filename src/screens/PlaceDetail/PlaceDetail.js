import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView, FlatList, Modal, Alert } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";

import ProductItem from '../../components/ProductItem/ProductItem';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import { getPlaceDetail, addToCart } from '../../store/actions/index';

class PlaceDetail extends Component {


    componentWillMount() {
        this.reset();
    }
    reset = () => {
        this.setState({
            viewMode: "portrait",
            modalVisible: false,
            selectedProduct: {
                id: '',
                title: '',
                description: '',
                logoUrl: '',
                price: ""
            },
            placesLoaded: false,
            removeAnim: new Animated.Value(1),
            placesAnim: new Animated.Value(0),
            qty: 1,
            product: {
                branchId: "",
                productId: "",
                qty: ""
            }
        });
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        Dimensions.addEventListener("change", this.updateStyles);
    }

    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                this.props.onLoadPlaceDetail(this.props.selectedPlace.id);
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
    };

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.updateStyles);
    }
    componentDidMount() {
        this.props.onLoadPlaceDetail(this.props.selectedPlace.id);
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

    updateStyles = dims => {
        this.setState({
            viewMode: dims.window.height > 500 ? "portrait" : "landscape"
        });
    };

    productAddedHandler = () => {
        this.props.onAddToCart(
            this.state.product.branchId,
            this.state.product.productId,
            this.state.qty,
            this.props.selectedCampaignId
        );
        this.setState({
            modalVisible: false
        })
    };

    setModalVisible = (visible, id) => {

        if (!visible) {
            this.setState({
                modalVisible: visible
            })
        } else {
            const selProduct = this.props.placeDetail[0].menuList[0].productList.find(product => {
                return product.id === id;
            });
            this.setState({
                modalVisible: visible,
                selectedProduct: selProduct,
                product: {
                    branchId: this.props.selectedPlace.id,
                    productId: selProduct.id
                }
            })
        }

    }

    productQtyPlusHandler = () => {
        this.setState({
            qty: this.state.qty + 1
        })
    }

    productQtyMinusHandler = () => {
        if (this.state.qty === 1) {
            return;
        }
        this.setState({
            qty: this.state.qty - 1
        })
    }


    render() {
        return (
            <ScrollView>
                <View
                    style={[
                        styles.container,
                        this.state.viewMode === "portrait"
                            ? styles.portraitContainer
                            : styles.landscapeContainer
                    ]}
                >
                    <View style={styles.placeDetailContainer}>

                        <View style={styles.subContainer}>
                            <View>
                                <Text style={styles.placeName}>
                                    {this.props.selectedPlace.companyName}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.subContainer}>
                            <Image
                                source={{ uri: this.props.placeDetail[0].companyLogoUrl.uri }}
                                style={styles.placeImage}
                            />
                        </View>
                    </View>

                    <View style={styles.container}>
                        <FlatList
                            style={styles.listContainer}
                            data={this.props.placeDetail[0].menuList}
                            renderItem={(info) => (
                                <View style={styles.productCategoryContainer}>
                                    <Text style={styles.productCategory}>{info.item.title}</Text>
                                    <FlatList
                                        data={info.item.productList}
                                        renderItem={(product) =>
                                            <ProductItem
                                                productTitle={product.item.title}
                                                description={product.item.description}
                                                price={product.item.price}
                                                logoUrl={product.item.logoUrl}
                                                onItemPressed={() => {
                                                    this.setModalVisible(true, product.item.id);
                                                }}
                                            />
                                        }
                                    />
                                </View>
                            )}
                        />
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.productDetailMasterContiner}>
                            <View style={styles.productDetailContiner}>
                                <Image style={styles.placeProductImage} source={{ uri: this.state.selectedProduct.logoUrl }} />
                                <View style={styles.desc}>
                                    <View>
                                        <Text style={styles.title}>{this.state.selectedProduct.title}</Text>
                                    </View>

                                    <View >
                                        <Text>{this.state.selectedProduct.description}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.priceContainer}>
                                <TouchableOpacity style={styles.priceElement}
                                    onPress={() => {
                                        this.productQtyPlusHandler();
                                    }}>
                                    <Icon name={"ios-add"} size={35} color="#000" />
                                </TouchableOpacity>

                                <View style={styles.priceElement}>
                                    <Text>{this.state.qty}{" Adet"}</Text>
                                </View>

                                <TouchableOpacity style={styles.priceElement}
                                    onPress={() => {
                                        this.productQtyMinusHandler();
                                    }}>
                                    <Icon name={"ios-remove"} size={35} color="#000" />
                                </TouchableOpacity>
                                <View style={styles.priceText}>
                                    <Text>{this.state.selectedProduct.price}{" TL"}</Text>
                                </View>
                            </View>


                        </View>
                        <ButtonWithBackground
                            color="#29aaf4"
                            onPress={() => {
                                this.productAddedHandler();
                            }}>
                            Sepete Ekle
                                </ButtonWithBackground>
                        <ButtonWithBackground
                            color="#ff0000"
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                            Kapat
                                </ButtonWithBackground>
                    </Modal>

                </View >
            </ScrollView >
        );
    }
};

const styles = StyleSheet.create({
    container: {
        margin: 15,
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
        fontWeight: "bold"
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
        placeDetail: state.placeDetail.placeDetail,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadPlaceDetail: (id) => dispatch(getPlaceDetail(id)),
        onAddToCart: (branchId, productId, qty, campaignId) => dispatch(addToCart(branchId, productId, qty, campaignId))

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceDetail);