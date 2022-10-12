import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import { Play } from 'phosphor-react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

const schemaValidateNewForm = zod.object({
  task: zod.string().min(1, 'Informe uma tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa de ser no mínimo de 60 minutos')
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
}

export function Home() {
  const [cycle, setCycle] = useState<Cycle[]>([]) // Armazenar os ciclos
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
    setAmountSecondsPassed(0)

    reset()
  }

  const activeCycle = cycle.find((item) => item.id === activeCycleId)

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startActive),
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

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
            step={5} // Intervalos
            min={5} // Valor mínimo
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

        <StartCountdownButton disabled={isDisabledButton} type="submit">
          <Play />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
