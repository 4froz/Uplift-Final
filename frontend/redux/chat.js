import {createSlice} from '@reduxjs/toolkit';

const chat = createSlice({
  name: 'tempUser',
  initialState: {
    communtiy:{},
  },
  reducers: {
    setChats: (state, action) => {
      state.communtiy = action.payload;
    },

    clearChats: state => {
      state.communtiy = {};
    },
  },
});

export const {setChats, clearChats} = chat.actions;

export default chat.reducer;
