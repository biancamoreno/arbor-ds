import { Clickable } from '../../core'
import type { ButtonProps } from '../interfaces'

export function Button({ children }: ButtonProps) {
  return (
    <Clickable
      alignItems="center"
      justifyContent="center"
      backgroundColor="brand.c"
      color="content.d"
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
