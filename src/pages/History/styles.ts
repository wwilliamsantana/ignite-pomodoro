import styled from 'styled-components'

export const HistoryContainer = styled.main`
  flex: 1; //Ocupar todo espaço disponível
  padding: 3.5rem;

  display: flex;
  flex-direction: column;
  h1 {
    font-size: 1.5rem;
    color: ${(props) => props.theme['gray-100']};
  }
`

export const HistoryList = styled.div`
  flex: 1; // Ocupar todo espaço disponível
  overflow: auto; //Para que ele crie a barra de rolagem de forma automatica
  margin-top: 2rem;

  table {
    width: 100%; //Ocupar toda a área
    border-collapse: collapse; // Ele junta as bordas, deixando de ser separadas como padrão.
    min-width: 600px; // Valor mínimo de largura, para que seja colocado o overflow

    th {
      background-color: ${(props) => props.theme['gray-600']};
      padding: 1rem;
      text-align: left; //Por padrão é center
      color: ${(props) => props.theme['gray-100']};
      font-size: 0.875rem;
      line-height: 1.6;

      &:first-child {
        //Primeiro eleemnto
        border-top-left-radius: 8px;
        padding-left: 1.5rem;
      }
      &:last-child {
        //Ultimo elemento
        border-top-right-radius: 8px;
        padding-right: 1.5rem;
      }
    }

    td {
      background-color: ${(props) => props.theme['gray-700']};
      border-top: 4px solid ${(props) => props.theme['gray-800']};
      // Como está tudo junto, ao adicionar uma border, separamos estes elementos.
      padding: 1rem;
      font-size: 0.875rem;
      line-height: 1.6;

      &:first-child {
        //Pegar os primeiros td's é adcionar um tamanho maior a ele
        width: 50%;
        padding-left: 1.5rem; // Afastando o primeiro elemento
      }
      &:last-child {
        padding-right: 1.5rem; // Afastando o último elemento
      }
    }
  }
`
const STATUS_COLOR = {
  // Objeto contendo nossas colors
  yellow: 'yellow-500',
  red: 'red-500',
  green: 'green-500',
} as const
// "as const" -> Definimos que eses valores nunca vão mudar, que serão constantes, que sempre serão estes! É por isso evitamos o erro do TypeScript

interface StatusProps {
  statusColor: keyof typeof STATUS_COLOR
}
// Colocando dessa forma conseguimos pegar apenas as chaves do nosso objeto, definindo os valores para nossa interface. Então caso seja adicionado uma cor, será automaticamente add na nossa interface

export const Status = styled.span<StatusProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    //Adicionar conteúdo
    content: ' '; // Conteúdo será vazio, pois precisa haver
    width: 0.5rem; // largura
    height: 0.5rem; // Altura
    border-radius: 9999px; // Deixando o elemento redondo
    background: ${(props) => props.theme[STATUS_COLOR[props.statusColor]]};
    //Para adicionar a color, pegamos a propriedade enviada no componente. Utilizamos está chave enviada no componente para pegar o valor dentro do nosso Objeto, consequentemente pegando o valor do defaultTheme
  }
`
