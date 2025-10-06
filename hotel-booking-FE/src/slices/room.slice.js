// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { roomApi } from "../api/room.api";
// import { payloadCreator } from "../utils/helper";

// export const createRoom = createAsyncThunk(
//   `"hotel/room/create"`,
//   payloadCreator(roomApi.createRoom)
// );
// export const getRoomByHotelId = createAsyncThunk(
//   "hotel/room/getByHotelId",
//   payloadCreator(roomApi.getRoomByHotelId)
// );
// export const searchRoomById = createAsyncThunk(
//   "hotel/room/searchRoomById",
//   payloadCreator(roomApi.searchRoomById)
// );
// export const deleteRoomById = createAsyncThunk(
//   "hotel/room/delete",
//   payloadCreator(roomApi.deleteRoomById)
// );
// export const updateRoomById = createAsyncThunk(
//   "hotel/room/update",
//   payloadCreator(roomApi.updateRoomById)
// );

//new 


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { roomApi } from "../api/room.api";
import { payloadCreator } from "../utils/helper";

// Async Thunks
export const createRoom = createAsyncThunk(
  "hotel/room/create",
  payloadCreator(roomApi.createRoom)
);

export const getRoomByHotelId = createAsyncThunk(
  "hotel/room/getByHotelId",
  // payloadCreator(roomApi.getRoomByHotelId)
  async ({ hotelId}) => {
    return await roomApi.getRoomByHotelId(hotelId);
  }
);
export const userGetRoomByHotelId = createAsyncThunk(
  "hotel/room/getByHotelId",
  // payloadCreator(roomApi.getRoomByHotelId)
  async ({ hotelId}) => {
    return await roomApi.userGetRoomByHotelId(hotelId);
  }
);

export const searchRoomById = createAsyncThunk(
  "hotel/room/searchRoomById",
  payloadCreator(roomApi.searchRoomById)
);

export const deleteRoomById = createAsyncThunk(
  "hotel/room/delete",
  payloadCreator(roomApi.deleteRoomById)
);

export const updateRoomById = createAsyncThunk(
  "hotel/room/update",
  async ({ hotelId, roomId, data }) => {
    return await roomApi.updateRoomById(hotelId, roomId, data);
  }
);

// Slice
const roomSlice = createSlice({
  name: "room",
  initialState: {
    rooms: [],
    currentRoom: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearRoomState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 createRoom
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
        state.success = true;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 getRoomByHotelId
      .addCase(getRoomByHotelId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoomByHotelId.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(getRoomByHotelId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 searchRoomById
      .addCase(searchRoomById.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(searchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 deleteRoomById
      .addCase(deleteRoomById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter((r) => r.id !== action.meta.arg);
        state.success = true;
      })
      .addCase(deleteRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 updateRoomById
      .addCase(updateRoomById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentRoom = action.payload;
        // cập nhật trong mảng rooms nếu có
        const idx = state.rooms.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) {
          state.rooms[idx] = action.payload;
        }
      })
      .addCase(updateRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRoomState } = roomSlice.actions;
export default roomSlice.reducer;
