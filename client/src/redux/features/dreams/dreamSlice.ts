import { createSlice } from "@reduxjs/toolkit";

interface Props {
  cardOpen: boolean;
  selectedCardId: string;
}

const initialState: Props = {
  cardOpen: false,
  selectedCardId: "",
};

const dreamSlice = createSlice({
  name: "dreams",
  initialState,
  reducers: {
    toggleCardOpen: (state, action) => {
      state.cardOpen = action.payload;
    },
    setSelectedCardId: (state, action) => {
      state.selectedCardId = action.payload;
    },
  },
});

export const { toggleCardOpen, setSelectedCardId } = dreamSlice.actions;
export default dreamSlice.reducer;
