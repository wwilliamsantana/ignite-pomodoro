import styled from 'styled-components'

export const LayoutContainer = styled.div`
  max-width: 74rem;
  min-height: 31rem;
  height: calc(
    100vh - 10rem
  ); //Ao invés de usarmos %, por ser mais chatinho de lidar, determinamos a medida com calc, pegando toda view port - 10rem
  margin: 5rem auto; // Aqui centralizamos esse container
  padding: 2.5rem; // Espaçamento interno

  background: ${(props) => props.theme['gray-800']};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
`
