import Svg, { Path } from "react-native-svg";

const ArrowBack = (props) => {
    return (
        <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M8 17L3 12M3 12L8 7M3 12H21" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
}

export default ArrowBack