import React from "react";
import { View } from "./View";

export const ShimmerGroupContext = React.createContext<ShimmerGroupContextType>({

});


export const ShimmerGroup = React.memo((props: ShimmerGroupProps) => {
    return (
        <ShimmerGroupContext.Provider value={{}}>

        </ShimmerGroupContext.Provider>
    )
})

export type ShimmerGroupProps = {
    children?: React.ReactNode[] | React.ReactNode
}

export type ShimmerGroupContextType = {

}

export const ShimmerItem = () => {
    return (
        <View style={{margin: 10, backgroundColor: 'grey', height: 200, aspectRatio: 1}}>
            <View />
        </View>
    )
}