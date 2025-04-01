import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'
import { ProductProps, StoreType, UserType } from '../type'

const customStorage = {
    getItem: (name:string) => {
        const item = localStorage.getItem(name)
        return item ? JSON.parse(item) : null
    },
    setItem: (name:string,value:any) => {
        localStorage.setItem(name,JSON.stringify(value))
    },

    removeItem: (name:string) => {
        localStorage.removeItem(name)
    }
}

export const store = create<StoreType>()(
    persist(
        (set) => ({
            currentUser: null,
            isLoading: true,
            cartProduct: [],
            favoriteProduct: [],

            getUserInfo: async (uid:any) => {
                if(!uid) return set({
                    currentUser: null,
                    isLoading: false,
                })
                const docRef = doc(db, "users", uid)
                const docSnap = await getDoc(docRef)
                
                try {
                    if(docSnap.exists()){
                        set({
                            currentUser: docSnap.data() as UserType,
                            isLoading: false
                        })
                    }else{
                        
                    }
                } catch (error) {
                    console.log(error)
                    set({
                        currentUser: null,
                        isLoading: false,
                    })
                }
            },

            
            addToCart: async(product:ProductProps) => {
                set((state:StoreType) => {
                    const existProduct = state.cartProduct.find((p) => p._id == product._id)
                    if(existProduct){
                        return {
                            cartProduct : state.cartProduct.map((item) => item._id === product._id ? {...item,quantity: item.quantity + 1} : item)
                        }
                    }
                    else{
                        return {
                            cartProduct: [...state.cartProduct,{...product,quantity: 1}]
                        }
                    }
                }) 
            },

            decreaseQuantity: (producId:number) => {
                set((state:StoreType) => {
                    return {
                        cartProduct : state.cartProduct.map((item) => item._id === producId ? {...item,quantity: item.quantity - 1} : item)
                    }
                })
            },

            removeFromCart: (producId:number) => {
                set((state:StoreType) => {
                    return {cartProduct: state.cartProduct.filter((item) => item._id !== producId)}
                })
            },

            resetCart: () => {
                set({cartProduct: []})
            } ,

            addToFavorite: (product:ProductProps) => {
                set((state:StoreType) => {
                    const isInFavorite = state.favoriteProduct.find((item) => item._id === product._id)
                    return {favoriteProduct : isInFavorite ? state.favoriteProduct.filter((item) => item._id != product._id)
                                        :  [...state.favoriteProduct,{...product}]}
                })
            },  

            removeFromfavorite: (producId:number) => {
                set((state:StoreType) => {
                    const isInFavorite = state.favoriteProduct.find((item) => item._id === producId)
                    if(isInFavorite){
                        return {favoriteProduct:state.favoriteProduct.filter((item) => item._id === producId)}
                    }else{
                        return{favoriteProduct:state.favoriteProduct}
                    }
                })
            },

            resetfavorite: () => {
                set({favoriteProduct:[]})
            },

            updateUserInfo: (userData: Partial<UserType>) => {
                set((prevState) => ({
                    currentUser: { ...prevState.currentUser as UserType, ...userData }
                }));
            }

        }),
        {
            name: 'store', 
            storage: customStorage, 
        },
    )
)

