import { AppStateStatus } from "react-native";
import { AnyAction } from 'redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

export type AppState = {
    applicationState: AppStateStatus,
    theme: AppTheme,
    language: AppLanguage
}

export type AppTheme = "dark" | "light"
export type AppLanguage = "en" | "vi"

const initalStates: AppState = {
    applicationState: "unknown",
    theme: "light",
    language: "vi",
}

const MainAppReducer = createSlice({
    name: 'mainAppReducer',
    initialState: initalStates,
    reducers: {
        changeApplicationState: (state, action: PayloadAction<AppStateStatus>) => { state.applicationState = action.payload; return state },
        changeTheme: (state, action: PayloadAction<AppTheme>) => { state.theme = action.payload; return state },
        changeLanguage: (state, action: PayloadAction<AppLanguage>) => { state.language = action.payload; return state },
    }
})

export const { changeApplicationState, changeTheme, changeLanguage } = MainAppReducer.actions

export const reducer = MainAppReducer.reducer



