import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform, Text, View, StyleSheet } from 'react-native';

const buttonWithBackground = props => {
    const content = (
        <View style={[styles.button, props.style, { backgroundColor: props.color }, props.disabled ? styles.disabled : null]}>
            <Text style={props.disabled ? styles.disabledText : [styles.text, props.styleText]}>{props.children}</Text>
        </View>
    );
    if (props.disabled) {
        return content;
    }
    if (Platform.OS === 'android') {
        return (
            <TouchableNativeFeedback onPress={props.onPress}>
                {content}
            </TouchableNativeFeedback>
        );
    } else {
        return (
            <TouchableOpacity onPress={props.onPress}>
                {content}
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
        textAlign: 'center'
    },
    disabled: {
        backgroundColor: '#eee',
        borderColor: '#aaa'
    },
    disabledText:{
        color: '#aaa'
    },
    text: {
        textAlign: 'center'
    }
})

export default buttonWithBackground;