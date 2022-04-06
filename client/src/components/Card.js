import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineHeart } from 'react-icons/ai';
import { GrFavorite } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { postOrder, deleteOrder, getAllProductsForSales } from '../Redux/Actions/actions';
import { MdLocalShipping } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';

export default function Card({
  id,
  image,
  name,
  price,
  shippingCost,
  path,
  title,
  stock,
  description,
  images,
  cartDB,
  wishListDB,
  token,
  postOrders,
  deleted,
  productSales,
  categorySales,
  globalSales,
}) {
  const dispatch = useDispatch();

  const [selectedWishList, setSelectedWishList] = useState(false);
  const [selectedCart, setSelectedCart] = useState(false);
  const [cartLS, setCartLS] = useState(window.localStorage.getItem('inCart'));
  const [wishListLS, setWishListLS] = useState(window.localStorage.getItem('inWishList'));
  const [saleON, setSaleON] = useState(false);
  const [saleSelected, setSaleSelected] = useState(undefined);

  useEffect(() => {
    if (token) {
      const foundProductInCart =
        !cartDB || cartDB.error == "couldn't find orders" || cartDB.length === 0
          ? null
          : cartDB.find((el) => el.id == id);
      const foundProductInWishList =
        !wishListDB ||
        wishListDB.error == "couldn't find orders" ||
        wishListDB.length === 0
          ? null
          : wishListDB.find((el) => el.id == id);
      if (foundProductInCart) {
        setSelectedCart(true);
      } else {
        setSelectedCart(false);
      }
      if (foundProductInWishList) {
        setSelectedWishList(true);
      } else {
        setSelectedWishList(false);
      }
    } else {
      setCartLS(window.localStorage.getItem('inCart'));
      setWishListLS(window.localStorage.getItem('inWishList'));

      const parsedCart = JSON.parse(cartLS);
      const parsedWishList = JSON.parse(wishListLS);

      const foundProductInCart =
        cartLS === null || cartLS.length === 0
          ? null
          : parsedCart && parsedCart.find((el) => el.productId == id);

      const foundProductInWishList =
        wishListLS === null || wishListLS.length === 0
          ? null
          : parsedWishList && parsedWishList.find((el) => el.productId == id);

      if (foundProductInCart) {
        setSelectedCart(true);
      } else {
        setSelectedCart(false);
      }
      if (foundProductInWishList) {
        setSelectedWishList(true);
      } else {
        setSelectedWishList(false);
      }
    }
    const date = Date();
    const days = [];
    if (productSales.length > 0) {
      for (const sale of productSales) {
        if (sale.day.slice(0, 3) == date.slice(0, 3).toLowerCase() || sale.day == 'all') {
          days.push(sale);
        }
      }
    }
    if (categorySales.length > 0) {
      for (const sale of categorySales) {
        if (sale.day.slice(0, 3) == date.slice(0, 3).toLowerCase() || sale.day == 'all') {
          days.push(sale);
        }
      }
    }
    if (globalSales.length > 0) {
      for (const sale of globalSales) {
        if (sale.day.slice(0, 3) == date.slice(0, 3).toLowerCase() || sale.day == 'all') {
          days.push(sale);
        }
      }
    }
    if (days.length > 0) {
      const sortedDays = days.sort((a, b) => b.percentage - a.percentage);
      setSaleSelected(sortedDays[0]);
      setSaleON(true);
    }
  }, [cartLS, wishListLS, deleted, postOrders, wishListDB, cartDB, productSales]);

  function addCartCategories() {
    if (!selectedCart) {
      dispatch(
        postOrder({
          status: 'inCart',
          amount: 1,
          productId: id,
          title: title,
          shippingCost: shippingCost,
          stock: stock,
          description: description,
          images: images,
          price: price,
        })
      );
      toast.success('Added to the cart !', {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      const foundProductInCart = cartDB && cartDB.find((el) => el.id == id);
      const orderId = foundProductInCart && foundProductInCart.orders[0].id;
      dispatch(deleteOrder(orderId, id, 'inCart'));
      toast.error('Removed from cart !', {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
    setCartLS(window.localStorage.getItem('inCart'));
  }

  function addFavCategories() {
    if (!selectedWishList) {
      dispatch(
        postOrder({
          status: 'inWishList',
          amount: 1,
          productId: id,
          title: title,
          shippingCost: shippingCost,
          stock: stock,
          description: description,
          images: images,
          price: price,
        })
      );
      toast.success('Added to the wishlist !', {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } else {
      const foundProductInWL = wishListDB && wishListDB.find((el) => el.id == id);
      const orderId = foundProductInWL && foundProductInWL.orders[0].id;
      dispatch(deleteOrder(orderId, id, 'inWishList'));
      toast.error('Removed from wishlist !', {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
    setWishListLS(window.localStorage.getItem('inWishList'));
  }

  return (
    <>
      <div
        id="card"
        className={
          (saleON && saleSelected.percentage ? 'border-t-[2px] border-orange-600 ' : '') +
          'flex rounded shadow-sm w-full bg-white lg:w-[48%] lg:justify-center'
        }
      >
        <div className="w-[30%] h-[170px] p-2 lg:h-[210px] lg:w-[35%]">
          <Link to={'/product/' + path} className="no-underline text-black">
            <div className="h-full w-full p-2 rounded hover:shadow-lg border-[1px] border-primary-300 hover:border-primary-700">
              <img
                className="h-full w-full rounded object-scale-down md:object-contain"
                src={image}
                alt={name}
              />
            </div>
          </Link>
        </div>
        <div className="w-[70%] flex flex-col gap-2 justify-between p-2 lg:w-[65%] relative">
          {saleON && (productSales.length > 0 || saleSelected.percentage) && (
            <div className="absolute inset-x-0 mx-auto -translate-y-6 border-[2px] border-orange-600 h-fit w-fit p-1 rounded text-base bg-white font-lora font-extrabold	 text-orange-600">
              <p>
                {saleON &&
                  ((productSales.length > 0 && productSales[0].percentage) ||
                    saleSelected.percentage)}
                % OFF{' '}
                {productSales.length > 0
                  ? productSales[0].productAmount > 0
                    ? `on ${productSales[0].productAmount + 1}º unit`
                    : ''
                  : saleSelected.productAmount > 0
                  ? `on ${saleSelected.productAmount + 1}º unit`
                  : ''}
              </p>
            </div>
          )}
          <div className="border-b-[1px] mt-2 border-primary-300 p-2 flex items-center justify-center text-center">
            <h3 className="text-sm font-lora font-bold md:text-base">{name}</h3>
          </div>
          <div className="flex justify-evenly items-center font-lora ">
            {productSales.length > 0 ? (
              productSales[0].productAmount === 0 ? (
                <div className="flex flex-col justify-center items-center">
                  <p
                    className={
                      (saleON && saleSelected.percentage
                        ? 'text-sm text-primary-400 line-through	xl:text-xl '
                        : 'text-primary-700 text-xl xl:text-2xl 2xl:text-3xl 2xl:font-black') +
                      'font-bold xl:border-b-[1px] xl:border-primary-300'
                    }
                  >
                    ${price}
                  </p>
                  {saleON && saleSelected.percentage ? (
                    <p className="font-bold text-primary-700 text-xl xl:text-2xl xl:border-b-[1px] xl:border-primary-300 2xl:text-3xl 2xl:font-black">
                      $
                      {(
                        price -
                        price *
                          ((productSales.length > 0 &&
                            productSales[0].percentage / 100) ||
                            saleSelected.percentage / 100)
                      ).toFixed(2)}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-primary-700 text-xl xl:text-2xl 2xl:text-3xl 2xl:font-black font-bold xl:border-b-[1px] xl:border-primary-300">
                  ${price}
                </p>
              )
            ) : saleSelected && saleSelected.productAmount === 0 ? (
              <div className="flex flex-col justify-center items-center">
                <p
                  className={
                    (saleON && saleSelected.percentage
                      ? 'text-sm text-primary-400 line-through	xl:text-xl '
                      : 'text-primary-700 text-xl xl:text-2xl 2xl:text-3xl 2xl:font-black') +
                    'font-bold xl:border-b-[1px] xl:border-primary-300'
                  }
                >
                  ${price}
                </p>
                {saleON && saleSelected.percentage ? (
                  <p className="font-bold text-primary-700 text-xl xl:text-2xl xl:border-b-[1px] xl:border-primary-300 2xl:text-3xl 2xl:font-black">
                    $
                    {(
                      price -
                      price *
                        ((productSales.length > 0 && productSales[0].percentage / 100) ||
                          saleSelected.percentage / 100)
                    ).toFixed(2)}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-primary-700 text-xl xl:text-2xl 2xl:text-3xl 2xl:font-black font-bold xl:border-b-[1px] xl:border-primary-300">
                ${price}
              </p>
            )}

            <div className="flex items-center gap-2">
              <MdLocalShipping className="h-6 w-6" color="#FEBD70" />
              <p className="flex gap-2 items-center md:text-base font-medium">
                ${shippingCost}
              </p>
            </div>
          </div>

          <div id="container2" className="flex justify-center gap-7">
            <div className="h-fit p-2 flex">
              <button
                onClick={() => addFavCategories()}
                className={
                  (selectedWishList ? 'bg-primary-400 ' : 'bg-white ') +
                  'flex items-center justify-center gap-2 rounded no-underline h-fit w-10 md:w-11 font-bold p-2 text-primary-400 bg-white border-[1px] border-primary-400 font-lora hover:border-primary-700 focus:border-primary-700 hover:text-primary-700 focus:text-primary-700 hover:shadow-md active:scale-95'
                }
              >
                <AiOutlineHeart
                  className="h-4 w-4 md:h-5 md:w-5 inline-block"
                  color={selectedWishList ? '#ffffff' : '#FEBD70'}
                />
              </button>
            </div>

            <div className="h-fit p-2 flex">
              <button
                onClick={() => addCartCategories()}
                className={
                  (selectedCart ? 'bg-primary-400 ' : 'bg-white ') +
                  'flex items-center justify-center gap-2 rounded no-underline h-fit w-10 md:w-11 font-bold p-2 text-primary-400 bg-white border-[1px] border-primary-400 font-lora hover:border-primary-700 focus:border-primary-700 hover:text-primary-700 focus:text-primary-700 hover:shadow-md active:scale-95'
                }
                to={'/cart'}
              >
                <AiOutlineShoppingCart
                  className="h-4 w-4 md:h-5 md:w-5 inline-block"
                  color={selectedCart ? '#ffffff' : '#FEBD70'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
