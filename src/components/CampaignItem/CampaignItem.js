import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const campaignItem = (props) => {
    return (
        <TouchableOpacity onPress={props.onItemPressed}>
            <View style={styles.listItem}>
                <Image style={styles.placeImage} source={{ uri: props.logoUrl }} />
                <View style={styles.desc}>
                    <View >
                        <Text>{props.description}</Text>
                    </View>
                </View>

                <View >
                    <Text>{props.price}</Text>
                </View>
            </View>
        </TouchableOpacity>

    )
};

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        flex: 1,
        marginBottom: 5,
        backgroundColor: "#eee",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    placeImage: {
        height: 250,
        width: "100%",

    },
    button: {
        margin: 8
    },
    desc: {
        flex: 2,
        width: "100%",
        flexDirection: "column",
        alignItems: "center"
    },
    title: {
        fontWeight: "bold"
    }
});

export default campaignItem;