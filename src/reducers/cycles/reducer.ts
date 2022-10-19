import { produce } from 'immer'
import { ActionsProp, ActionTypes } from './action'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startActive: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: ActionsProp) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })

    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      // return {
      //   ...state,
      //   cycles: state.cycles.map((cycle) => {
      //     if (cycle.id === state.activeCycleId) {
      //       return { ...cycle, interruptedDate: new Date() }
      //     } else {
      //       return cycle
      //     }
      //   }),
      //   activeCycleId: null,

      const currentCycleActive = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleActive < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.cycles[currentCycleActive].interruptedDate = new Date()
        draft.activeCycleId = null
      })
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleActive = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleActive < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.cycles[currentCycleActive].finishedDate = new Date()
        draft.activeCycleId = null
      })
    }

    default:
      return state
  }
}
