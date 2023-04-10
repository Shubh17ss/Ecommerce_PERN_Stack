import {createContext, useState} from 'react';

export const Context=createContext();

export const Provider=({children})=>{

    let prevCart=JSON.parse(localStorage.getItem('Cart') || "[]");
    const [products, setProducts]=useState([]);
    const [cart, setCart]=useState(prevCart!==null?prevCart:[]);
    const [cartTotal, setCartTotal]=useState(0);

    return(
        <Context.Provider
            value={{
                products,setProducts,
                cart, setCart,
                cartTotal, setCartTotal
                
            }}
        >
            {children}
        </Context.Provider>
    )
}