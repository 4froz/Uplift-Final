import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"userInfo",
    initialState:{
      name:"Nologin"
    },
    reducers:{
       login:(state,action) => {
        return{
            ...action.payload
        }
       },
       logout:(state,action) => {
         return{
          name:"Nologin"
         }
       }
    }
})

export const { login,logout } = userSlice.actions;

export default userSlice.reducer;