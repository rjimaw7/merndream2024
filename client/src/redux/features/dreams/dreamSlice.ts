import { createSlice } from "@reduxjs/toolkit";

interface Props {
  cardOpen: boolean;
  selectedCardId: string;
  searchQuery: string;
}

const initialState: Props = {
  cardOpen: false,
  selectedCardId: "",
  searchQuery: "",
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
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { toggleCardOpen, setSelectedCardId, setSearchQuery } =
  dreamSlice.actions;
export default dreamSlice.reducer;
