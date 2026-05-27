import type { PayloadAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type {
  AddBookPayload,
  BookMetadata,
  BooksState,
} from "../types/types";

export interface RootState {
  books: BooksState;
}

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

export type UpdateBookPayload = { id: string } & Partial<BookMetadata>;

export type AddBookAction = PayloadAction<AddBookPayload>;
export type SetActiveBookAction = PayloadAction<string>;
export type UpdateBookAction = PayloadAction<UpdateBookPayload>;
export type HydrateBooksAction = PayloadAction<BooksState>;
