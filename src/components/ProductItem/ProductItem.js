import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const productItem = (props) => {
    return (
        <TouchableOpacity onPress={props.onItemPressed}>
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

                <View >
                    <Text>{props.price}{" TL"}</Text>
                </View>
            </View>
        </TouchableOpacity>

    )
};

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
    }
});

export default productItem;