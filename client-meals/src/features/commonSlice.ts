// Part 1
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Part 2
export interface IssueInitialState {
     id: string | null
     show: boolean
     editing: boolean
}
const initialState: IssueInitialState = {
    id: null,
    show:false,
    editing:false
}

// Part 3
export const commonSlice = createSlice({
    name: 'issue',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction) => {
            state.show = true
        },

        closeModal: (state, action: PayloadAction) => {
            state.show = false
        }, 
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        }, 
        isEditing: (state, action: PayloadAction) => {
            state.editing = true
        }, 
        isNotEditing: (state, action: PayloadAction) => {
            state.editing = false
        }, 


    }
})

// Part 4
export const { openModal ,closeModal ,setId ,isEditing , isNotEditing} = commonSlice.actions
export default commonSlice.reducer