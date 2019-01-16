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
import OrderItem from "../../components/OrderItem/OrderItem";
import { getOrders } from '../../store/actions/index';

class OrdersPage extends Component {
    static navigatorStyle = {
        navBarButtonColor: "orange"
    };

    componentWillMount() {
        this.reset();
    }
    reset = () => {
        this.setState({
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
                this.props.onGetOrders();
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

    render() {
        return (
            <ScrollView>
                <FlatList
                    style={styles.listContainer}
                    data={this.props.orders}
                    renderItem={(info) => (
                        <View style={styles.productCategoryContainer}>
                            <Text style={styles.productCategory}>{info.item.companyName}</Text>
                            <Text style={styles.orderInfo}>Order Number: {info.item.orderNumber}</Text>
                            <Text style={styles.orderInfo}>Toplam: {info.item.paidPrice} TL</Text>
                            <Text style={styles.orderInfo}>Sipariş Tarihi: {info.item.dateCreated}</Text>
                            <Text style={info.item.status == 'PREPARING' ? styles.orderInfo : {display: 'none'}}>{info.item.status == 'PREPARING' ? 'Tahmini Hazır Olma Zamanı: ' + info.item.dateReady : ''}</Text>
                            <Text style={styles.orderInfo}>Durum: {info.item.status == 'PAYMENT_SUCCESS' ? 'Ödeme Başarılı' : info.item.status == 'PAYMENT_FAILED' ? 'Ödeme Hatası' : info.item.status == 'PREPARING' ? 'Hazırlanıyor' : info.item.status == 'READY' ? 'Hazır' : info.item.status == 'CANCELED_BY_BRANCH' ? 'Restorant Tarafından İptal Edildi' : info.item.status == 'CANCEL_REQUESTED' ? 'İptal İsteği Yapıldı' : info.item.status == 'CANCELED_BY_USER' ? 'CANCELED_BY_USER' : 'Kullanıcı Tarafından İptal Edildi'}</Text>
                            <View style={styles.productList}>
                                <Text>Products</Text>
                            </View>
                            <FlatList
                                data={info.item.productList}
                                renderItem={(productItem) =>
                                    <OrderItem
                                        productTitle={productItem.item.product.title}
                                        description={productItem.item.product.description}
                                        logoUrl={productItem.item.product.logoUrl}
                                        price={productItem.item.product.price}
                                        qty={productItem.item.quantity}
                                    />
                                }
                            />
                        </View>
                    )}
                />
            </ScrollView>

        );
    }
}
const styles = StyleSheet.create({
    productList: {

    },
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
        marginBottom: 30,
    },
    productCategory: {
        fontWeight: "bold",
        fontSize: 16,
        borderBottomColor: 'orange',
        borderBottomWidth: 3,
        width: "50%"
    },
    orderInfo: {
        fontWeight: "bold",
        fontSize: 13
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
        orders: state.orders.orders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetOrders: () => dispatch(getOrders())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrdersPage);
