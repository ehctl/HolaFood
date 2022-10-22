import React from "react";

export enum FoodListType {
    POPULAR_FOOD = 'Popular Food' ,
    FAVORITE_FOOD = 'Favorite Food' ,
    NEW_FOOD = 'New Food' ,
}

export const FoodListScreenContext = React.createContext<FoodListScreenContextType>({
    foodListType: FoodListType.POPULAR_FOOD,
    changeFoodListType: (_: FoodListType) => { }
});

export type FoodListScreenContextType = {
    foodListType: FoodListType,
    changeFoodListType: (type: FoodListType) => void
}
