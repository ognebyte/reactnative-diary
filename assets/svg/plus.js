import Svg, { Path } from "react-native-svg";

const Plus = (props) => {
    return (
        <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12 6V18M18 12H6"
            stroke={props.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
}
export default Plus