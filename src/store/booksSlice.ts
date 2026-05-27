import { createSlice } from "@reduxjs/toolkit";
import type { BooksState } from "../types/types";
import type {
  AddBookAction,
  HydrateBooksAction,
  SetActiveBookAction,
  UpdateBookAction,
} from "./types";

const initialState: BooksState = {
  items: [],
  activeBookId: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action: AddBookAction) => {
      state.items.push(action.payload);
      state.activeBookId = action.payload.id;
    },
    setActiveBook: (state, action: SetActiveBookAction) => {
      state.activeBookId = action.payload;
    },
    updateBook: (state, action: UpdateBookAction) => {
      const book = state.items.find((item) => item.id === action.payload.id);
      if (book) {
        Object.assign(book, action.payload);
      }
    },
    hydrateBooks: (_state, action: HydrateBooksAction) => action.payload,
  },
});

export const { addBook, setActiveBook, updateBook, hydrateBooks } =
  booksSlice.actions;
export default booksSlice.reducer;
