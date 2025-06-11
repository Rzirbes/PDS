import { StyleSheet } from 'react-native'

export const getEntityItemStyles = (colors: {
  background: string
  primary: string
  secondary: string
  text: string
  muted: string
  success: string
  danger: string
}) =>
  StyleSheet.create({
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      marginBottom: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    email: {
      fontSize: 14,
      color: colors.muted,
    },
    status: {
      fontWeight: '600',
      fontSize: 14,
    },
    active: {
      color: colors.success,
    },
    inactive: {
      color: colors.danger,
    },
  })
