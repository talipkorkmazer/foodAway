import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const orderItem = (props) => {


    return (
        <View style={styles.listItem}>
            <Image style={styles.placeImage} source={{ uri: props.logoUrl }} />
            <View style={styles.desc}>
                <View>
                    <Text style={styles.title}>{props.productTitle}</Text>
                </View>

                <View >
                    <Text>{props.description}</Text>
                </View>
            </View>
            <View style={styles.priceContainer}>
                <View style={styles.priceElement}>
                    <Text>{props.qty}{" Adet"}</Text>
                </View>

                <View style={styles.priceText}>
                    <Text>{props.price}{" TL"}</Text>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        marginBottom: 5,
        padding: 5,
        backgroundColor: "#eee",
        flexDirection: "row",
        alignItems: "center"
    },
    placeImage: {
        marginRight: 5,
        height: 90,
        width: 90
    },
    button: {
        margin: 8
    },
    desc: {
        flex: 2,
        width: "35%",
        flexDirection: "column",
        alignItems: "flex-start"
    },
    title: {
        fontWeight: "bold"
    },
    priceElement: {
        marginRight: 5
    },
    priceText: {
        //right: 0,
        //position: "absolute",
        //marginRight: 30
    },
    priceContainer: {
        flex: 1,

        flexDirection: "column",
        alignItems: "center"
    },
});

export default orderItem;