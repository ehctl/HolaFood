import React from "react";

export enum FoodListType {
    POPULAR_FOOD = 'Popular Food' ,
    FAVORITE_FOOD = 'Favorite Food' ,
    NEW_FOOD = 'New Food' ,
}

export const FoodListScreenContext = React.createContext<FoodListScreenContextType>({
    foodListType: 'popular',
    changeFoodListType: (_: string) => { }
});

export type FoodListScreenContextType = {
    foodListType: string | number,
    changeFoodListType: (type: string | number) => void
}
