import React from 'react';
import {
    StyleSheet, View,
    ScrollView, FlatList
} from 'react-native';

import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import ListItem from '../ListItem/ListItem';
import CustomMarker from '../CustomMarker/CustomMarker';

const tabBar = (props) => {
    
    return (
        <ScrollableTabView
            style={styles.container}
            renderTabBar={() => <DefaultTabBar backgroundColor='rgba(255, 255, 255, 0.7)' />}
            tabBarPosition='overlayTop'
        >
            <View tabLabel='Harita'>
                <CustomMarker places={props.places} onItemPressed={props.onItemSelected} onLocateMe={props.onLocateMe}
                />
            </View>
            <ScrollView tabLabel='Liste'>
                <FlatList
                    style={styles.listContainer}
                    data={props.places}
                    renderItem={(info) => (
                        <ListItem
                            branchName={info.item.branchName}
                            companyName={info.item.companyName}
                            onItemPressed={() => props.onItemSelected(info.item.key)}
                            key={info.item.key}
                        />
                    )}
                />
            </ScrollView>
        </ScrollableTabView>
    );

};

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        marginBottom: 5,
        padding: 10,
        backgroundColor: "#eee",
        flexDirection: "row",
        alignItems: "center"
    },
    placeImage: {
        marginRight: 8,
        height: 30,
        width: 30
    },
    listContainer: {
        marginTop: 60
    }
});

export default tabBar;