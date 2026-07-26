import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

backButton: {
    width:40,
    height:40,
    justifyContent:'center',
    alignItems:'center',
},

  header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 40,
  marginBottom: 36,
  gap: 12,
},

headerBar: {
  flexDirection: 'row',
  alignItems: 'center',
  // justifyContent: 'space-between',
  paddingHorizontal: 5,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderWhite,
},
headerTitle: {
  fontSize: 15,
  fontWeight: '700',
  letterSpacing: 1,
  color: '#111',
},
referralCard: {
  backgroundColor: colors.backgroundDark,
  borderRadius: 20,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  // marginHorizontal: 6,
  marginTop: 4,
  marginBottom: 20,
},
referralIcon: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: colors.backgroundDark,
  alignItems: 'center',
  justifyContent: 'center',
},
referralTitle: {
  color: colors.textOnDark,
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 2,
},
referralSubtitle: {
  color: colors.textOnDark,
  fontSize: 12,
  lineHeight: 16,
},

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 28,
    // marginBottom: 16,
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    flex:1,
  },

  profileButton: {
    backgroundColor: '#BCFF00',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },

  profileButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },

  menu: {
    backgroundColor: colors.background,
    borderRadius: 18,
    overflow: 'hidden',
  },

  menuItem: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderWhite,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuTitle: {
    marginLeft: 14,
    fontSize: 16,
    color: colors.textPrimary,
  },

  logoutButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.backgroundDark,
  },

  logoutText: {
    color: colors.textOnDark,
    fontSize: 15,
    fontWeight: '700',
  },

  menuItemActive: {
  backgroundColor: 'rgba(188, 255, 0, 0.10)',
},
subMenu: {
  backgroundColor: 'rgba(188, 255, 0, 0.05)',
  paddingLeft: 34,
},
subMenuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 14,
  paddingRight: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#F0F0F0',
},
subMenuTitle: {
  fontSize: 14,
  color: '#333',
},

appSettingsCard: {
  backgroundColor: '#BCFF00',
  borderRadius: 16,
  paddingHorizontal: 16,
  marginVertical: 6,
},
appSettingsHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 16,
},
settingRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 14,
},
settingLabel: {
  fontSize: 12,
  fontWeight: '700',
  color: '#08221C',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
},
settingValue: {
  fontSize: 13,
  fontWeight: '700',
  color: '#111',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  textDecorationLine: 'underline',
},

});