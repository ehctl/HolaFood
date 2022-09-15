import { Style } from "../assets/css/Style";
import { en } from '../language/en'
import { vi } from '../language/vi'

export default class Warehouse {
  private static _instance?: Warehouse;
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
  public getStyles = () => Style
  public getLanguage = () => this.language
}