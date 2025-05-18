import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { apilink } from "../../common";

export const getBuscityapi = createAsyncThunk(
  "buscity/fetch",
  async ({ limit = 100, offset = 0, search = '' } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${apilink}/bus/cities`, {
        params: { limit, offset, search }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const buscityslice = createSlice({
  name: "buscity",
  initialState: { info: [], isLoading: false, isError: false },
  extraReducers: (builder) => {
    builder
      .addCase(getBuscityapi.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBuscityapi.fulfilled, (state, action) => {
        state.info = action.payload;
        state.isLoading = false;
      })
      .addCase(getBuscityapi.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export default buscityslice.reducer;