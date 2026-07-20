import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors'
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';

export const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:colors.backgroundAlt,
        padding:20,
    },


    header:{
        marginTop:40,
        height:50,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },


    headerTitle:{
        color:colors.textPrimary,
        fontSize:18,
        fontWeight:'700',
    },


    content:{
        marginTop:40,
    },


    title:{
        color:colors.textPrimary,
        fontSize:28,
        fontWeight:'800',
    },


    subtitle:{
        color:colors.textSecondary,
        fontSize:16,
        marginTop:8,
        marginBottom:40,
    },


    option:{
        height:70,
        backgroundColor:colors.backgroundDark,
        borderRadius:16,
        marginBottom:16,
        paddingHorizontal:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },


    left:{
        flexDirection:'row',
        alignItems:'center',
    },


    optionText:{
        color:colors.textOnDark,
        fontSize:18,
        fontWeight:'600',
        marginLeft:15,
    },

});