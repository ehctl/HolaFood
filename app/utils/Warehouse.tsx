import { AppStateStatus } from "react-native";
import { Style } from "../../assets/css/Style";
import { en } from '../language/en'
import { vi } from '../language/vi'

export default class Warehouse {
  private static _instance?: Warehouse;
  private appState: AppStateStatus = 'unknown'
  private style = Style;
  private language = {
    'en': en,
    'vi': vi
  }

  constructor() { }

  static getInstance = (): Warehouse => {
    if (!this._instance)
      this._instance = new Warehouse()
    return this._instance
  }


  public getStyle = () => this.style
  public getLanguage = () => this.language
  public getAppState = () => this.appState
  public setAppState = (state: AppStateStatus) => this.appState = state
}