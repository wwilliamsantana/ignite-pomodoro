import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import { Play, HandPalm } from 'phosphor-react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'

const schemaValidateNewForm = zod.object({
  task: zod.string().min(1, 'Informe uma tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa de ser no mínimo de 60 minutos')
    .max(60, 'O ciclo precisa de ser no máximo de 60 minutos'),
})

// Estamos fazendo a validação com o próprio HTML é com button desabilitado, não havendo necessidade de utilizar o zod, está implementado mais para FINS DIDÁTICO

type newCycleFormData = zod.infer<typeof schemaValidateNewForm>
// Simplificamos utilizadno o zod, ao invé sde criamos uma interface manual

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startActive: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycle] = useState<Cycle[]>([]) // Armazenar os ciclos
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // Armazenar o ID do ciclo que estará ativo no momento
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<newCycleFormData>({
    // Formulário
    resolver: zodResolver(schemaValidateNewForm),
    defaultValues: {
      minutesAmount: 0,
      task: '',
    },
  })

  // Criação do Cycle
  function handleCreateNew(data: newCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startActive: new Date(),
    }

    setCycle((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0) // Zeramos isso para ttoda vez que iniciamos nosso countdown ele começe do 0

    reset()
  }

  const activeCycle = cycles.find((item) => item.id === activeCycleId) // Buscando o cycle que está ativo
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

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
          setCycle((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setActiveCycleId(null) // Projeto ele está usando "setAmountSecondsPassed(totalSeconds)" Aguardar
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference) // A função "differenceInSeconds" está calculando a quantidade de segundos. Pegando o DateAtual com a do nosso Date do Cycle (Momento de criação)
        }
      }, 1000) // Nosso interval está atualizando a cada 1s
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, totalSeconds])

  // Pegando os valores de minutes/seconds

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60 // Resto

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    // Utilizamos esse useEffect para atualizar o title da página com nossos minutes/seconds.
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
    // Colocamos dependências em minutes/seconds/active, qualquer elemento que sofrer mudança irá chamar nossa function
  }, [minutes, seconds, activeCycle])

  function handleInterruptedCycle() {
    // Percorrendo Array de Cycles = Fizemos uma condição para capturar o elemento que está ativo, quando encontrar, adicionamos uma Data a propriedade de interruptedDate. É para os outros elementos, apenas retornaremos o element
    setCycle((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null) // Atualizamos o estado de Cycle Ativo
  }

  const task = watch('task') // Observando nosso input em tempo real
  const isDisabledButton = !task // Variável auxiliar para utilizarmos na condicional do disabled button

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNew)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            disabled={!!activeCycle}
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          {/* DataList de seugestão -> Linkamos o id a tag "list" dentro do Input */}
          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Projeto 3"></option>
            <option value="Banana"></option>
          </datalist>

          <label htmlFor="minutesAmount">Durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            disabled={!!activeCycle} // Retornar tru/false
            step={5} // Intervalos
            min={1} // Valor mínimo
            max={60} // Valor máximo
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptedCycle} type="button">
            <HandPalm />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isDisabledButton} type="submit">
            <Play />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
