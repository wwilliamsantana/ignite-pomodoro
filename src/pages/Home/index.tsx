import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

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

const schemaValidateFormInput = zod.object({
  task: zod.string().min(1, 'Informe uma tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa de ser no mínimo de 60 minutos')
    .max(60, 'O ciclo precisa de ser no máximo de 60 minutos'),
})

// Estamos fazendo a validação com o próprio HTML é com button desabilitado, não havendo necessidade de utilizar o zod, está implementado mais para FINS DIDÁTICO

export function Home() {
  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(schemaValidateFormInput),
  })

  function handleCreateNew(data: any) {
    console.log(data)
  }

  const task = watch('task')
  const isDisabledButton = !task

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
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isDisabledButton} type="submit">
          <Play />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
