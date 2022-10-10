import { AppStateStatus } from "react-native";
import { AnyAction } from 'redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { OrderItemType } from "../screens/Order/Order";

export type AppState = {
    applicationState: AppStateStatus,
    theme: AppTheme,
    language: AppLanguage,
    orders: OrderItemType[],
    userType: UserType,
    newOrderNotification: boolean,
    selectedBottomTabIndex: number
}

export type AppTheme = "dark" | "light"
export type AppLanguage = "en" | "vi"
export type UserType = "user" | "shipper"

const initalStates: AppState = {
    applicationState: "unknown",
    theme: "light",
    language: "vi",
    orders: [],
    userType: 'user',
    newOrderNotification: false,
    selectedBottomTabIndex: 0
}

const MainAppReducer = createSlice({
    name: 'mainAppReducer',
    initialState: initalStates,
    reducers: {
        changeApplicationState: (state, action: PayloadAction<AppStateStatus>) => { state.applicationState = action.payload; return state },
        changeTheme: (state, action: PayloadAction<AppTheme>) => { state.theme = action.payload; return state },
        changeLanguage: (state, action: PayloadAction<AppLanguage>) => { state.language = action.payload; return state },
        addOrders: (state, action: PayloadAction<OrderItemType[]>) => { state.orders = [...action.payload, ...state.orders]; state.newOrderNotification = true; return state },
        setOrders: (state, action: PayloadAction<OrderItemType[]>) => { state.orders = action.payload; return state },
        setUserType: (state, action: PayloadAction<UserType>) => { state.userType = action.payload; return state },
        setNewOrderNotification: (state, action: PayloadAction<boolean>) => { state.newOrderNotification = action.payload; return state },
        setSelectedBottomTabIndex: (state, action: PayloadAction<number>) => { state.selectedBottomTabIndex = action.payload; return state },
    }
})

export const { changeApplicationState, changeTheme, changeLanguage, addOrders, setOrders, setUserType, setNewOrderNotification, setSelectedBottomTabIndex } = MainAppReducer.actions

export const reducer = MainAppReducer.reducer



