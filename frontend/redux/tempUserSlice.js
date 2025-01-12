import {createSlice} from '@reduxjs/toolkit';

const tempUserSlice = createSlice({
  name: 'tempUser',
  initialState: {
    username: '',
    name: '',
    email: '',
    password: '',
    goal: '',
    goalCategory: '',
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    set_Name: (state, action) => {
      state.name = action.payload;
    },
    set_Email: (state, action) => {
      state.email = action.payload;
    },
    set_Password: (state, action) => {
      state.password = action.payload;
    },
    setGoal: (state, action) => {
      state.goal = action.payload;
    },
    setGoalCategory: (state, action) => {
      state.goalCategory = action.payload;
    },
    clearTempUser: state => {
      state.id = '';
      state.name = '';
      state.email = '';
      state.password = '';
      state.age = null;
    },
  },
});

export const {
  setUsername,
  set_Name,
  set_Email,
  set_Password,
  setGoal,
  clearTempUser,
  setGoalCategory,
} = tempUserSlice.actions;

export default tempUserSlice.reducer;
