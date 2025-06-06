import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apilink } from "../../common";




export const getAllCountries = createAsyncThunk('/getcountries', async () => {
  const res = await axios.get(`${apilink}/countries`); 

  return res.data.data; 
});


export const getAllcityes = createAsyncThunk('/getcity', async ({ countryCode, value }) => {

  const res = await axios.get(`${apilink}/cities?CountryCode=${countryCode}&search=${value}`);
  console.log("City API Response:", countryCode);
  return res.data;
});





const citysearchSlice = createSlice({
    name: "getcity",
    initialState: {
    countries: [],
    info: [],
    isLoading: false,
    isError: false,
    error: null,
  },
    extraReducers: (builder) => {
        builder
      .addCase(getAllCountries.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getAllCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllCountries.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.error = action.payload;
      });

    // Handle getAllcityes
    builder
      .addCase(getAllcityes.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getAllcityes.fulfilled, (state, action) => {
        state.cities = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllcityes.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.error = action.payload;
      });
    },
  });
  

 
  export default citysearchSlice.reducer;
  