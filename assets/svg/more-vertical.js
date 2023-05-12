import Svg, { Path, G } from 'react-native-svg'

const MoreVertical = props => {
  return (
    <Svg width={props.size} height={props.size} viewBox='0 0 24 24' fill='#000000'>
      {/* <title/> */}

      <G id='Complete'>
        <G id='F-More'>
          <Path
            d='M12,16a2,2,0,1,1-2,2A2,2,0,0,1,12,16ZM10,6a2,2,0,1,0,2-2A2,2,0,0,0,10,6Zm0,6a2,2,0,1,0,2-2A2,2,0,0,0,10,12Z'
            id='Vertical'
          />
        </G>
      </G>
    </Svg>
  )
}

export default MoreVertical
