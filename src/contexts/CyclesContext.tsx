import { createContext, ReactNode, useReducer, useState } from 'react'
import { ActionTypes, Cycle, cyclesReducer } from '../reducers/cycles'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  cycles: Cycle[]
  markCurrentCycleAsFinished: () => void
  setSecondPassed: (seconds: number) => void
  interruptedCycle: () => void
  createNewCycle: (data: CreateCycleData) => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CycleContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const { cycles, activeCycleId } = cyclesState

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((item) => item.id === activeCycleId)

  function setSecondPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startActive: new Date(),
    }

    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle,
      },
    })
    setAmountSecondsPassed(0)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId,
      },
    })
  }

  function interruptedCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
      payload: {
        activeCycleId,
      },
    })
  }
  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        setSecondPassed,
        amountSecondsPassed,
        interruptedCycle,
        createNewCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
