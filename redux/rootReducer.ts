import { baseApi } from "./api/baseApi";
import localCartReducer from "./features/localCartSlice";
import wishlistReducer from "./features/wishlistSlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  localCart: localCartReducer,
  wishlist: wishlistReducer,
};
