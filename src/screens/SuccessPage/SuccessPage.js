import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView, FlatList, Modal, ActivityIndicator } from "react-native";

import { connect } from "react-redux";

import { placeOrder } from "../../store/actions/index";
import CartProductItem from '../../components/CartProductItem/CartProductItem';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import Icon from "react-native-vector-icons/Ionicons";
import MainText from "../../components/UI/MainText/MainText";
import HeadingText from "../../components/UI/HeadingText/HeadingText";

class SuccessPage extends Component {
  static navigatorStyle = {
    navBarButtonColor: "orange"
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
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
  componentDidMount = () => {
    this.props.onPlaceOrder(
      this.props.orderData.basketId,
      this.props.orderData.cardHolderName,
      this.props.orderData.cardNumber,
      this.props.orderData.cvc,
      this.props.orderData.expireMonth,
      this.props.orderData.expireYear,
      this.props.orderData.registerCard
    );
  }
  componentDidUpdate = () => {

  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Your order number is:          </HeadingText>
            <HeadingText style={{ color: "red" }}>{this.props.order.orderNumber}</HeadingText>
          </MainText>
        </View>
      </ScrollView>
    );
  }
}

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
  },
  totals: {
    flexDirection: "row",
    justifyContent: 'center'
  },
  totalText: {
    fontWeight: "bold"
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    order: state.order.order
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPlaceOrder: (basketId, cardHolderName, cardNumber, cvc, expireMonth, expireYear, registerCard) => dispatch(placeOrder(basketId, cardHolderName, cardNumber, cvc, expireMonth, expireYear, registerCard))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SuccessPage);
