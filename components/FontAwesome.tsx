import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { useSelector } from "react-redux";
import Colors from "../constants/Colors";
import { FontAwesomeIconType } from "../constants/FontAwesomeIconType";
import { AppState } from "../redux/Reducer";
import { FontAwesome as FontAwesomeDefault} from '@expo/vector-icons';
import { useTheme } from "./Themed";


export function FontAwesome(props: IconProps<FontAwesomeIconType>) {
    const theme = useTheme()
  
    return <FontAwesomeDefault {...props} color={Colors[theme].text} />;
  }
  
  