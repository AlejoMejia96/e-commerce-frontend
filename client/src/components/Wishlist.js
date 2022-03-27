import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer/Footer';
import CardWishlist from './CardWishlist';
import { getOrder } from "../Redux/Actions/actions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Wishlist({}) {
    const dispatch = useDispatch();
  const product = useSelector((state) => state.home.inWishList);


  useEffect(() => {

    dispatch(getOrder({ status: "inWishList" }));
  }, [dispatch]);

  
    return (
        <>
        <NavBar/>
        <div className='wishlist'>
            <h1>This is Wishlist</h1>
            {product.length > 0 &&
        product.map((prod) => {
      
          return (
            <div>
 
              <CardWishlist 
               id={prod.id}
               idOrder={prod.orders[0].id}
               title={prod.title}
                price={prod.price}
                images={prod.images[0].url}
                shippingCost={prod.shippingCost}
                stock={prod.stock}
                key={prod.id}
                
              />
            </div>
          );
        })}
            
        </div>
        <Footer/>
        </>
    );
}