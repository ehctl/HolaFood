import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { useSelector } from "react-redux";
import Colors from "../constants/Colors";
import { FontAwesomeIconType } from "../constants/FontAwesomeIconType";
import { AppState } from "../redux/Reducer";
import { FontAwesome as FontAwesomeDefault} from '@expo/vector-icons';
import { useTheme } from "./Themed";
import { AntDesign } from '@expo/vector-icons'; 
import { AntTypeIconType } from "../constants/AntTypeIconType";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialIconType } from "../constants/MaterialIconType";

export function FontAwesome(props: IconProps<FontAwesomeIconType>) {
    const theme = useTheme()

    return <FontAwesomeDefault  color={Colors[theme].text} {...props}  />;
  }
  
export function FontAwesome1(props: IconProps<AntTypeIconType>) {
    const theme = useTheme()

    return <AntDesign  color={Colors[theme].text} {...props}  />;
}
  
export function FontAwesome2(props: IconProps<MaterialIconType>) {
    const theme = useTheme()

    return <MaterialIcons  color={Colors[theme].text} {...props}  />;
}
  

  