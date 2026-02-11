import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CVType, PersonalDataType } from '../types';

const initialState: CVType = {
  personalData: {
    fullName: '',
    email: '',
  },
  experienceData: [],
  abilitiesData: [],
  languagesData: [],
  educationData: [],
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    updatePersonalData(
      state,
      action: PayloadAction<Partial<PersonalDataType>>
    ) {
      state.personalData = { ...state.personalData, ...action.payload };
    },
  },
});

export const { updatePersonalData } = cvSlice.actions;
export default cvSlice.reducer;
