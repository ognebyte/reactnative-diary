import Svg, { Path } from "react-native-svg";

const ArrowForward = (props) => {
    return (
        <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M16 7L21 12M21 12L16 17M21 12H3" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
}

export default ArrowForward