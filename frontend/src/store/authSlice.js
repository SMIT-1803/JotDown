import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    isBootstrapping:true
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser: (state,action)=>{
            state.user = action.payload
        },
        clearUser:(state,action)=>{
            state.user=null
        },
        finishBootstrap:(state,action)=>{
            state.isBootstrapping = false;
        }

    }
})

export const {setUser, clearUser, finishBootStrap} = authSlice.actions
export default authSlice.reducer