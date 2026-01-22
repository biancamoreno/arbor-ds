import { Clickable } from '../../core'
import type { ButtonProps } from '../interfaces'

export function Button({ children }: ButtonProps) {
  return (
    <Clickable
      alignItems="center"
      justifyContent="center"
      backgroundColor="brand.base"
      color="content.inverse"
      borderRadius="medium"
      borderWidth={0}
      cursor="pointer"
      px="medium"
      py="small"
    >
      {children}
    </Clickable>
  )
}
