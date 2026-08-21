import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

container:{
    flex:1
},

map:{
    width:'100%',
    height:'100%'
},

center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
},
drawPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#061414',
    borderWidth: 1.5,
    borderColor: '#BCFF00',
  },
  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#378ADD',
    borderWidth: 3,
    borderColor: '#fff',
  },
  drawLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});