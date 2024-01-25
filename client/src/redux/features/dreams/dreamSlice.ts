import { createSlice } from "@reduxjs/toolkit";

interface Props {
  cardOpen: boolean;
  selectedCardId: string;
  isEditDream: boolean;
}

const initialState: Props = {
  cardOpen: false,
  selectedCardId: "",
  isEditDream: false,
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
    setIsEditDream: (state, action) => {
      state.isEditDream = action.payload;
    },
  },
});

export const { toggleCardOpen, setSelectedCardId, setIsEditDream } =
  dreamSlice.actions;
export default dreamSlice.reducer;
