import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apilink } from "../../common";

export const getCountriesApi = createAsyncThunk(
  "countries/getCountries",
  async () => {
    const response = await axios.get(`${apilink}/matrix/countries`);

    console.log("Countries API Response:", );
    return response.data.data;
  }
);

const countriesSlice = createSlice({
  name: "countries",
  initialState: {
    countries: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCountriesApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCountriesApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.countries = action.payload;
      })
      .addCase(getCountriesApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default countriesSlice.reducer;