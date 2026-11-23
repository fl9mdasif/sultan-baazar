import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WishlistItem = {
    productId: string;
    name: string;
    thumbnail?: string;
    price: number;
    variantId: string;
    variantName: string;
};

const load = (): WishlistItem[] => {
    try { return JSON.parse(localStorage.getItem("sb_wishlist") || "[]"); } catch { return []; }
};
const save = (items: WishlistItem[]) => {
    try { localStorage.setItem("sb_wishlist", JSON.stringify(items)); } catch { /* noop */ }
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: { items: [] as WishlistItem[] },
    reducers: {
        hydrateWishlist(state) {
            state.items = load();
        },
        toggleWishlist(state, action: PayloadAction<WishlistItem>) {
            const idx = state.items.findIndex(i => i.productId === action.payload.productId);
            if (idx >= 0) state.items.splice(idx, 1);
            else state.items.push(action.payload);
            save(state.items);
        },
        removeFromWishlist(state, action: PayloadAction<string>) {
            state.items = state.items.filter(i => i.productId !== action.payload);
            save(state.items);
        },
    },
});

export const { hydrateWishlist, toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
