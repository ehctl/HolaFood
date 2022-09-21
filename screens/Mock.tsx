import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Animated, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, ScrollView } from "react-native";
import { View } from "../components/View";
import { Level1Header } from '../components/Headers/Level1Header';
import { Text } from "../components/Text";
import { wait } from "../utils/Utils";
import React from "react";

export const Mock = React.memo(({ navigation }: any) => {
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    
    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                scrollEventThrottle={16}
                stickyHeaderHiddenOnScroll={true}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]} 
                refreshControl={
                    <RefreshControl  refreshing={refreshing} onRefresh={onRefresh}/>
                }>
                <Level1Header onLeftIconPress={navigation} title='Mock Screen' />

                {DATA.map((book, index) => {
                    return (
                        <Text style={{ height: 100 }} key={book.id} text={book.title} />
                    )
                })}
            </ScrollView>
        </View>
    );
})

const DATA = [
    {
        id: 1,
        title: 'Modern JS: A curated collection'
    },
    {
        id: 2,
        title: 'JavaScript notes for professionals'
    },
    {
        id: 3,
        title: 'JavaScript: The Good Parts'
    },
    {
        id: 4,
        title: 'JavaScript: The right way'
    },
    {
        id: 5,
        title: 'Exploring ES6'
    },
    {
        id: 6,
        title: 'JavaScript Enlightenment'
    },
    {
        id: 7,
        title: 'You dont know JS'
    },
    {
        id: 8,
        title: 'Learn JavaScript'
    },
    {
        id: 9,
        title: 'JavaScript succintly'
    },
    {
        id: 10,
        title: 'Human JavaScript'
    },
    {
        id: 11,
        title: 'JavaScript design patterns'
    },
    {
        id: 12,
        title: "JS50: 50 illustrations in JS"
    },
    {
        id: 13,
        title: 'Eloqent JavaScript'
    },
    {
        id: 14,
        title: 'Practical ES6'
    },
    {
        id: 15,
        title: 'Speaking JavaScript'
    },
    {
        id: 115,
        title: 'Exploring ES6'
    },
    {
        id: 236,
        title: 'JavaScript Enlightenment'
    },
    {
        id: 127,
        title: 'You dont know JS'
    },
    {
        id: 1238,
        title: 'Learn JavaScript'
    },
    {
        id: 1239,
        title: 'JavaScript succintly'
    },
    {
        id: 12310,
        title: 'Human JavaScript'
    },
    {
        id: 12311,
        title: 'JavaScript design patterns'
    },
    {
        id: 1113112,
        title: "JS50: 50 illustrations in JS"
    },
    {
        id: 1313,
        title: 'Eloqent JavaScript'
    },
    {
        id: 3214,
        title: 'Practical ES6'
    },
    {
        id: 131215,
        title: 'Speaking JavaScript'
    },
    {
        id: 13215,
        title: 'Exploring ES6'
    },
    {
        id: 6111,
        title: 'JavaScript Enlightenment'
    },
    {
        id: 7332,
        title: 'You dont know JS'
    },
    {
        id: 1318,
        title: 'Learn JavaScript'
    },
    {
        id: 589,
        title: 'JavaScript succintly'
    },
    {
        id: 878710,
        title: 'Human JavaScript'
    },
    {
        id: 1881,
        title: 'JavaScript design patterns'
    },
    {
        id: 18782,
        title: "JS50: 50 illustrations in JS"
    },
    {
        id: 18763,
        title: 'Eloqent JavaScript'
    },
    {
        id: 68614,
        title: 'Practical ES6'
    },
    {
        id: 18315,
        title: 'Speaking JavaScript'
    }
];