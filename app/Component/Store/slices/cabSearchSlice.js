import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apilink } from "../../common";

// Existing thunk for GET cab cities
export const getCabCityApi = createAsyncThunk("cabSearch/getCabCityApi", async () => {
  const response = await axios.get(`${apilink}/cab-search`);
  return response.data;
});

// New thunk for POST cab search
export const searchCabApi = createAsyncThunk(
  "cabSearch/searchCabApi",
  async (searchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apilink}/transfer-search`, searchData); // Replace with your POST API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cabSearchSlice = createSlice({
  name: "cabSearch",
  initialState: {
    info: {
      CabCities: [],
      searchResults: null, // Add field for search results
    },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Existing GET cab cities cases
      .addCase(getCabCityApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCabCityApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.info.CabCities = action.payload;
      })
      .addCase(getCabCityApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // New POST cab search cases
      .addCase(searchCabApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchCabApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.info.searchResults = action.payload;
      })
      .addCase(searchCabApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default cabSearchSlice.reducer;