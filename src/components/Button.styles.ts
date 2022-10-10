import styled from 'styled-components'

export type ButtonColors = 'primary' | 'success' | 'danger'

interface ButtonProps {
  variant: ButtonColors
}

const colors = {
  primary: 'blue',
  danger: 'red',
  success: 'green',
}

export const ButtonContainer = styled.button<ButtonProps>`
  width: 100px;
  height: 40px;

  background-color: ${(props) => props.theme['green-500']};
  color: ${(props) => props.theme.white};

  /* ${(props) => `background-color: ${colors[props.variant]}`} */
`
