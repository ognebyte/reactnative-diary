import Svg, { Path } from "react-native-svg";

const Check = (props) => {
    return (
        <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M19.5 7L9 17.5L5 13.5" stroke={props.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
}
export default Check