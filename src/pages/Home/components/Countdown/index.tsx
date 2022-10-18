import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'

import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60 // Resto

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // Countdown
  useEffect(() => {
    let interval: number // Variável vazia

    // Condicional para verificar se temos um cycle ativo
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startActive,
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondPassed(0)
          clearInterval(interval)
        } else {
          setSecondPassed(secondsDifference) // A função "differenceInSeconds" está calculando a quantidade de segundos. Pegando o DateAtual com a do nosso Date do Cycle (Momento de criação)
        }
      }, 1000) // Nosso interval está atualizando a cada 1s
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    activeCycleId,
    totalSeconds,
    setSecondPassed,
    markCurrentCycleAsFinished,
  ])

  useEffect(() => {
    // Utilizamos esse useEffect para atualizar o title da página com nossos minutes/seconds.
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
    // Colocamos dependências em minutes/seconds/active, qualquer elemento que sofrer mudança irá chamar nossa function
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
