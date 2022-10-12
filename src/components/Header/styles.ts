import styled from 'styled-components'

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 0.5rem;

    a {
      width: 3rem;
      height: 3rem;

      display: flex;
      justify-content: center;
      align-items: center;

      color: ${(props) => props.theme['gray-100']};

      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      // Adicionamos essas border para que quando for colocado no Hover não seja empurrado para cima o elemento

      &:hover {
        border-bottom: 3px solid ${(props) => props.theme['green-500']};
      }

      &.active {
        // Quando estamos no link selecionado ele vai adicionar esta classe 'active' -> É nisso conseguimos adicionar um color
        color: ${(props) => props.theme['green-500']};
      }
    }
  }
`
