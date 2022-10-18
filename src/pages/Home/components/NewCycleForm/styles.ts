import styled from 'styled-components'

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${(props) => props.theme['gray-100']};
  font-size: 1.125rem;
  font-weight: bold;
  flex-wrap: wrap; //É para quebrar linha quando não caber na viewPort
`

// Fizemos uma base default para o input, pois são caracteristicas que se repetem entre nossos Inputs
const BaseInput = styled.input`
  background: transparent;
  height: 2.5rem;
  border: 0;
  border-bottom: 2px solid ${(props) => props.theme['gray-500']};
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${(props) => props.theme['gray-100']};

  &:focus {
    box-shadow: none;
    border-color: ${(props) => props.theme['green-500']};
  }

  &::placeholder {
    color: ${(props) => props.theme['gray-500']};
  }
`
// Ao utilizar a base do input, chamamos o styled como função passando a baseInput como argumento.
export const TaskInput = styled(BaseInput)`
  flex: 1; //Ocupar todo espaço

  &::-webkit-calendar-picker-indicator {
    display: none !important; //Retirar "setinha" que fica no canto do input text
  }
`

export const MinutesAmountInput = styled(BaseInput)`
  width: 4rem; //Atribuimos um tamanho fixo
`
