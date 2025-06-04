import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apilink } from "../../common";

export const getEsimplansApi = createAsyncThunk(
  "countries/getCountries",
  async () => {
    const response = await axios.get(`${apilink}/matrix/plans`);

    console.log("Countries API Response:", );
    return response.data.data;
  }
);

const getEsimplans = createSlice({
  name: "esimplans",
  initialState: {
    countries: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEsimplansApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEsimplansApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.countries = action.payload;
      })
      .addCase(getEsimplansApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default getEsimplans.reducer;