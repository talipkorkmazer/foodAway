import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Animated, Button, ScrollView, FlatList, Modal, ActivityIndicator } from "react-native";

import { connect } from "react-redux";

import { getCart, addToCart, removeFromCart, setProductToCart, removeCart } from "../../store/actions/index";
import CartProductItem from '../../components/CartProductItem/CartProductItem';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import Icon from "react-native-vector-icons/Ionicons";
import PlaceInput from "../../components/PlaceInput/PlaceInput";

class CartScreen extends Component {
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
      orderModalVisible: false,
      campaignId: '',
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
      },
      controls: {
        basketId: "",
        cardHolderName: {
          value: "",
          valid: false
        },
        cardNumber: {
          value: "",
          valid: false
        },
        cvc: {
          value: "",
          valid: false
        },
        expireMonth: {
          value: "",
          valid: false
        },
        expireYear: {
          value: "",
          valid: false
        },
        registerCard: false
      }
    });
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
        this.props.onGetCart();
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

  componentDidUpdate = () => {
    if (this.state.modalVisible) {
      this.props.navigator.switchToTab({ tabIndex: 1 });
      this.props.navigator.switchToTab({ tabIndex: 2 });
    }
  }


  productAddedHandler = () => {
    this.props.onSetProductToCart(
      this.state.product.branchId,
      this.state.product.productId,
      this.state.qty,
      this.state.campaignId
    );
    this.props.onGetCart();
    this.setState({
      modalVisible: false
    })
    if (this.state.modalVisible) {
      this.props.navigator.switchToTab({ tabIndex: 1 });
      this.props.navigator.switchToTab({ tabIndex: 2 });
    }
  };

  productRemovedHandler = () => {
    //this.props.onGetCart();

    this.props.onRemoveFromCart(
      this.state.product.branchId,
      this.state.product.productId
    );
    this.props.onGetCart();
    this.setState({
      modalVisible: false
    })
    if (this.state.modalVisible) {
      this.props.navigator.switchToTab({ tabIndex: 1 });
      this.props.navigator.switchToTab({ tabIndex: 2 });
    }
  };

  removeCartHandler = (branchId) => {

    this.props.onRemoveCart(
      branchId
    );
    this.props.onGetCart();
  }


  setModalVisible = (visible, product, branch) => {
    if (!visible) {
      this.setState({
        modalVisible: visible
      })
      this.props.onGetCart();

    } else {
      this.setState({
        modalVisible: visible,
        selectedProduct: product.product,
        qty: product.quantity,
        product: {
          branchId: branch.branchId,
          productId: product.product.id
        },
        campaignId: branch.campaignId
      })
    }

  }

  setOrderModalVisible = (visible, branchId) => {
    if (!visible) {
      this.setState({
        orderModalVisible: visible
      })
    } else {
      this.setState(prevState => {
        return {
          orderModalVisible: visible,
          controls: {
            ...prevState.controls,
            basketId: this.props.cart[0].id
          }
        }
      });
    }
  }

  onPlaceOrderHandler = () => {
    this.props.navigator.push({
      screen: "awesome-places.SuccessPage",
      title: "SuccessPage",
      passProps: {
        orderData: {
          basketId: this.state.controls.basketId,
          cardHolderName: this.state.controls.cardHolderName.value,
          cardNumber: this.state.controls.cardNumber.value,
          cvc: this.state.controls.cvc.value,
          expireMonth: this.state.controls.expireMonth.value,
          expireYear: this.state.controls.expireYear.value,
          registerCard: this.state.controls.registerCard
        }
      }
    });
    this.setState({
      orderModalVisible: false
    })
  }

  productQtyPlusHandler = () => {
    this.setState({
      qty: this.state.qty + 1
    })
  };
  productQtyMinusHandler = () => {
    if (this.state.qty === 1) {
      return;
    }
    this.setState({
      qty: this.state.qty - 1
    })
  };
  cartNumberChangedHandler = val => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          cardNumber: {
            value: val,
            valid: true
          }
        }
      }
    });
  };
  cardHolderNameChangedHandler = val => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          cardHolderName: {
            value: val,
            valid: true
          }
        }
      }
    });
  };
  cvcChangedHandler = val => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          cvc: {
            value: val,
            valid: true
          }
        }
      }
    });
  };
  expireMonthChangedHandler = val => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          expireMonth: {
            value: val,
            valid: true
          }
        }
      }
    });
  };
  expireYearChangedHandler = val => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          expireYear: {
            value: val,
            valid: true
          }
        }
      }
    });
  };

  render() {
    let submitButton = (
      <Button style={{ backgroundColor: "#00B200" }}
        title="Ödeme Yap"
        onPress={this.onPlaceOrderHandler}
        disabled={
          !this.state.controls.cardHolderName.valid ||
          !this.state.controls.cardNumber.valid ||
          !this.state.controls.expireMonth.valid ||
          !this.state.controls.expireYear.valid ||
          !this.state.controls.cvc.valid
        }
      />
    );

    if (this.props.cart.length == 0) {
      if (this.props.cart === false) {
        return (
          <View>
            <Text>Sepetiniz boş</Text>
          </View>
        );
      } else {
        return (
          <ActivityIndicator />
        );
      }
    } else {
      if (this.props.cart === false) {
        return (
          <View>
            <Text>Sepetiniz boş</Text>
          </View>
        );
      } else {
        return (

          <ScrollView style={styles.container}>
            <FlatList
              style={styles.listContainer}
              data={this.props.cart}
              renderItem={(branch) => (
                <View style={styles.productCategoryContainer}>
                  <Text style={styles.productCategory}>{branch.item.companyName}</Text>
                  <FlatList
                    data={branch.item.productList}
                    renderItem={(product) =>
                      <CartProductItem
                        productTitle={product.item.product.title}
                        description={product.item.product.description}
                        price={product.item.product.price}
                        logoUrl={product.item.product.logoUrl}
                        qty={product.item.quantity}
                        onItemPressed={() => {
                          this.setModalVisible(true, product.item, branch.item);
                        }}
                      />
                    }

                  />

                  <View style={styles.totals}>


                    <View style={{ justifyContent: 'flex-start' }}>
                      <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: 'red' }}>{branch.item.totalPrice == branch.item.paidPrice ? '' : '\t\t\t\t\t\t\t' + branch.item.totalPrice}</Text>
                      <Text style={styles.totalText}>Toplam: {branch.item.paidPrice}</Text>
                    </View>
                    <View>
                      <ButtonWithBackground
                        color="#00B200"
                        styleText={{ color: "#fff" }}
                        style={{ justifyContent: "flex-end" }}
                        onPress={() => {
                          this.setOrderModalVisible(true, branch.item.id);
                        }}>
                        Ödeme Yap
                  </ButtonWithBackground>
                    </View>
                    <View>
                      <ButtonWithBackground
                        color="red"
                        styleText={{ color: "#fff" }}
                        style={{ justifyContent: "flex-end" }}
                        onPress={() => {
                          this.removeCartHandler(branch.item.branchId);
                        }}>
                        Sepeti Sil
                  </ButtonWithBackground>
                    </View>
                  </View>

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
                Sepeti Güncelle
              </ButtonWithBackground>
              <ButtonWithBackground
                color="#ff0000"
                styleText={{ color: "#fff" }}
                onPress={() => {
                  this.productRemovedHandler();
                }}>
                Ürünü Sil
              </ButtonWithBackground>
              <ButtonWithBackground
                color="#000"
                styleText={{ color: "#fff" }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                Kapat
              </ButtonWithBackground>

            </Modal>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.orderModalVisible}
              onRequestClose={() => {
                //Alert.alert('Modal has been closed.');
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Card Holder Name</Text>
              <PlaceInput
                value={this.state.controls.cardHolderName}
                onChangeText={this.cardHolderNameChangedHandler}
                placeholder="Card Holder Name"
              />
              <Text style={{ fontWeight: "bold" }}>Card Number</Text>
              <PlaceInput
                value={this.state.controls.cardNumber}
                onChangeText={this.cartNumberChangedHandler}
                placeholder="Card Number"
              />
              <Text style={{ fontWeight: "bold" }}>Expire Month</Text>
              <PlaceInput
                value={this.state.controls.expireMonth}
                onChangeText={this.expireMonthChangedHandler}
                placeholder="Expire Month"
              />
              <Text style={{ fontWeight: "bold" }}>Expire Year</Text>
              <PlaceInput
                value={this.state.controls.expireYear}
                onChangeText={this.expireYearChangedHandler}
                placeholder="Expire Year"
              />
              <Text style={{ fontWeight: "bold" }}>Cvc</Text>
              <PlaceInput
                value={this.state.controls.cvc}
                onChangeText={this.cvcChangedHandler}
                placeholder="Cvc"
              />


              <View style={styles.button}>{submitButton}</View>

              <ButtonWithBackground
                color="#000"
                styleText={{ color: "#fff" }}
                onPress={() => {
                  this.setOrderModalVisible(!this.state.orderModalVisible);
                }}>
                Kapat
              </ButtonWithBackground>

            </Modal>
          </ScrollView>
        );
      }
    }


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
    justifyContent: 'flex-end'
  },
  totalText: {
    fontWeight: "bold"
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    cart: state.cart.cart,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCart: () => dispatch(getCart()),
    onAddToCart: (branchId, productId, qty) => dispatch(addToCart(branchId, productId, qty)),
    onSetProductToCart: (branchId, productId, qty, campaignId) => dispatch(setProductToCart(branchId, productId, qty, campaignId)),
    onRemoveFromCart: (branchId, productId) => dispatch(removeFromCart(branchId, productId)),
    onRemoveCart: (branchId) => dispatch(removeCart(branchId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
