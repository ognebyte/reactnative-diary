import Svg, { Path } from 'react-native-svg'

const IconClipboard = ({size}) => {
  return (
    <Svg
      width={size} height={size}
      viewBox='0 0 24 24' fill='none'
    >
      <Path
        d='M9 17H12M9 9H15M9 13H15M10 2H14M7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21Z'
        stroke='#000000' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'
      />
    </Svg>
  )
}

export default IconClipboard
