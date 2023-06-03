import Svg, { Path, G } from 'react-native-svg'

const LogOut = ({ size, color }) => {
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M14 20H6C4.89543 20 4 19.1046 4 18L4 6C4 4.89543 4.89543 4 6 4H14M10 12H21M21 12L18 15M21 12L18 9'
        stroke={color} strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'
      />
    </Svg>
  )
}

export default LogOut
