import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import api from "../API";

interface Product {
    productId: string;
    name: string;
    price: number;
    image_urls?: string;
    quantity: number;
}

interface CartContextType {
    cart: Product[];
    isCartLoading: boolean;
    addItemMutation: any;
    updateItemMutation: any;
    removeItemMutation: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
    | { type: "SET_CART"; payload: Product[] }
    | { type: "ADD_TO_CART"; payload: Product }
    | { type: "UPDATE_CART_ITEM"; payload: Product }
    | { type: "REMOVE_FROM_CART"; payload: { productId: string } };

const cartReducer = (state: Product[], action: CartAction): Product[] => {
    switch (action.type) {
        case "SET_CART":
            return action.payload;
        case "ADD_TO_CART":
            return [...state, action.payload];
        case "UPDATE_CART_ITEM":
            return state.map((item) =>
                item.productId === action.payload.productId ? action.payload : item
            );
        case "REMOVE_FROM_CART":
            return state.filter((item) => item.productId !== action.payload.productId);
        default:
            return state;
    }
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, dispatch] = useReducer(cartReducer, []);
    const queryClient = useQueryClient();

    // Fetch cart data
    const { data: cartData, isLoading: isCartLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const response = await api.get("/cart");
            return response.data;
        },
    });

    // Add item to cart
    const addItemMutation = useMutation({
        mutationFn: async (item: Product) => {
            const response = await api.post("/cart", item);
            return response.data;
        },
        onSuccess: (data) => {
            dispatch({ type: "ADD_TO_CART", payload: data });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
    });

    // Update cart item
    const updateItemMutation = useMutation({
        mutationFn: async (item: Product) => {
            const response = await api.put(
                `/cart/${item.productId}`,
                item
            );
            return response.data;
        },
        onSuccess: (data) => {
            dispatch({ type: "UPDATE_CART_ITEM", payload: data });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
    });

    // Remove item from cart
    const removeItemMutation = useMutation({
        mutationFn: async (productId: string) => {
            await api.delete(`/cart/${productId}`);
            return productId;
        },
        onSuccess: (_, productId) => {
            dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
    });

    useEffect(() => {
        if (cartData) {
            dispatch({ type: "SET_CART", payload: cartData });
        }
    }, [cartData]);

    return (
        <CartContext.Provider
            value={{
                cart,
                isCartLoading,
                addItemMutation,
                updateItemMutation,
                removeItemMutation,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};