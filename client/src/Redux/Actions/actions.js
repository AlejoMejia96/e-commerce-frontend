import axios from "axios";
import { requestInterceptor, responseInterceptor } from "./interceptors";
import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_PRODUCT_BY_ID,
  GET_SEARCH,
  POST_NEWUSER,
  VALIDATE_MAIL,
  LOGIN_USER,
  POST_ORDERS,
  GET_ORDERS,
  GET_USER_INFO,
  PUT_PRODUCT_BY_ID,
  DELETE_ORDERS,
  GET_COMMENT_BY_ID,
  PUT_USER_INFO,
  PUT_USER_ADMIN,
  GET_USERS_INFO,
  GET_SALES,
  GET_PRODUCTS_SALES,
  PUT_ORDERS,
  PUT_ORDERS_AMOUNT,
  DELETE_SALE,
  POST_NEW_ADRESS_USER,
  CLEAR_TOKENS_USER,
  CLEAR_PRODUCT_DETAIL,
  CLEAR_PRODUCT_AND_CATEGORY,
  DELETE_ADRESS_USER,
  DELETE_USER_INFO,
  DELETE_USER_ADMIN,
  CLEAR_USER_EMAIL,
  CLEAR_CARRUSEL,
  POST_BULK_ORDER,
  GET_BULK_ORDERS,
  PUT_BULK_ORDERS
} from "./types";

requestInterceptor();
responseInterceptor();

// action para traer los productos
export function getProducts(search) {
  return async function (dispatch) {
    var json = await axios.get(`/products${search}`);

    return dispatch({
      type: GET_PRODUCTS,
      payload: json.data,
    });
  };
}

//action para traer las categorias
export function getCategories() {
  return async function (dispatch) {
    var json = await axios.get("/categories");
    return dispatch({
      type: GET_CATEGORIES,
      payload: json.data,
    });
  };
}

//action para traer el producto por id
export function getProductByID(id) {
  return async function (dispatch) {
    try {
      var json = await axios.get("/products/" + id);
      return dispatch({
        type: GET_PRODUCT_BY_ID,
        payload: json.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function putProductByID(id, body) {
  return async function (dispatch) {
    try {
      var json = await axios.put("/products/" + id, body);

      return dispatch({
        type: PUT_PRODUCT_BY_ID,
        payload: json.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function updateComment(comment, token) {
  return async function () {
    try {
      const commentUpdated = await axios.put("/comment", comment);
      return commentUpdated;
    } catch (error) {
      console.log(error);
    }
  };
}

export function postComment(comment, token) {
  return async function () {
    try {
      const commentCreated = await axios.post("/comment", comment);
      return commentCreated;
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteComment(id, token) {
  return async function () {
    try {
      const commentDeleted = await axios.delete("/comment", {
        data: { id: id },
      });
      return commentDeleted;
    } catch (error) {
      console.log(error);
    }
  };
}

export function getCommentByID(id) {
  return async function (dispatch) {
    try {
      var json = await axios.get(`/comment?productId=${id}`);
      return dispatch({
        type: GET_COMMENT_BY_ID,
        payload: json.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

//
export function getSearch(query) {
  return async (dispatch) => {
    try {
      const products = await axios.get(`/products?limit=100&search=${query}`);
      const categories = await axios.get(`/categories?search=${query}`);
      return dispatch({
        type: GET_SEARCH,
        payload: { products: products.data, categories: categories.data },
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function postProduct(product) {
  return async function () {
    const create = await axios.post("/products", product);
    return create;
  };
}

export function postNewUser(obj) {
  return async function (dispatch) {
    const user = await axios.post("/user", obj);
    return dispatch({
      type: POST_NEWUSER,
      payload: user.data,
    });
  };
}

export function loginUser(val) {
  return async function (dispatch) {
    const login = await axios.post("/user/login", val);
    return dispatch({
      type: LOGIN_USER,
      payload: login.data,
    });
  };
}

export function validateMail(mail) {
  return async function (dispatch) {
    const validate = await axios.post("/user/email", mail);
    return dispatch({
      type: VALIDATE_MAIL,
      payload: validate.data,
    });
  };
}

export function postOrder(order) {
  const token = window.localStorage.getItem("access");
  if (token) {
    return async function (dispatch) {
      var json = await axios.post(`/order`, order);
      return dispatch({
        type: POST_ORDERS,
        payload: { status: order.status, data: json.data },
      });
    };
  } else {
    if (order.status == "inWishList" || order.status == "inCart") {
      if (!window.localStorage.getItem(`${order.status}`)) {
        const product = {
          status: order.status,
          productId: order.productId,
          id: order.productId,
          title: order.title,
          shippingCost: order.shippingCost,
          stock: order.stock,
          description: order.description,
          images: order.images,
          orders: [{ id: 0, amount: order.amount }],
          price: order.price,
        };
        var arr = [];
        arr.push(product);
        window.localStorage.setItem(`${order.status}`, JSON.stringify(arr));
        var item = window.localStorage.getItem(`${order.status}`);
      } else {
        const product = {
          status: order.status,
          productId: order.productId,
          id: order.productId,
          title: order.title,
          shippingCost: order.shippingCost,
          stock: order.stock,
          description: order.description,
          images: order.images,
          orders: [{ id: 0, amount: order.amount }],
          price: order.price,
        };
        var item = window.localStorage.getItem(`${order.status}`);
        var parsedItem = JSON.parse(item);
        parsedItem.push(product);
        window.localStorage.setItem(
          `${order.status}`,
          JSON.stringify(parsedItem)
        );
      }
    }
    return {
      type: POST_ORDERS,
      payload: "sarasa",
    };
  }
}

// para llamar cart y whislist -finali -proces
//json.data es un array de objetos
export function getOrder(order) {
  const token = window.localStorage.getItem("access");

  if (token) {
    return async function (dispatch) {
      var json = await axios.get(`/order?status=` + order.status);
      return dispatch({
        type: GET_ORDERS,
        payload: { status: order.status, data: json.data },
      });
    };
  } else {
    return function (dispatch) {
      const item = window.localStorage.getItem(`${order.status}`);
      const parsedItem = JSON.parse(item);
      return dispatch({
        type: GET_ORDERS,
        payload: { status: order.status, data: parsedItem },
      });
    };
  }
}

export function changeOrderStatus(order) {
  return async function (dispatch) {
    var json = await axios.put(`/order/${order.id}`,{status: order.status,date:order.date});
    return dispatch({
      type: PUT_ORDERS,
      payload: { status: order.status, data: json.data },
    });
  };
}

export function changeOrderAmount(order, id, status) {
  console.log("order", order);
  const token = window.localStorage.getItem("access");
  if (token) {
    return async function (dispatch) {
      var json = await axios.put(`/order/${order.id}?amount=${order.amount}`);
      return dispatch({
        type: PUT_ORDERS_AMOUNT,
        payload: { status: order.status, data: json.data },
      });
    };
  } else {
    return function (dispatch) {
      const item = window.localStorage.getItem(`${status}`);
      const parsedItem = item && JSON.parse(item);
      const itemChange =
        parsedItem &&
        parsedItem.map((el) => {
          if (el.productId === id) {
            if (Math.abs(el.orders[0].amount + order.amount) < 1) {
              return {
                error: "amount is less than one",
              };
            }
            el.orders[0].amount = el.orders[0].amount + order.amount;
          }
          return el;
        });
      const itemsFilter =
        itemChange &&
        itemChange.filter((el) => {
          if (!el.hasOwnProperty("error")) {
            return el;
          }
        });
      window.localStorage.setItem(`${status}`, JSON.stringify(itemsFilter));
      return dispatch({
        type: PUT_ORDERS_AMOUNT,
        payload: { status: status, data: itemsFilter },
      });
    };
  }
}

export function deleteOrder(order, id, status) {
  const token = window.localStorage.getItem("access");
  if (token) {
    return async function (dispatch) {
      var json = await axios.delete(`/order/${order}`);
      return dispatch({
        type: DELETE_ORDERS,
        payload: json.data,
      });
    };
  } else {
    return function (dispatch) {
      const item = window.localStorage.getItem(`${status}`);
      const parsedItem = item && JSON.parse(item);
      const itemDeleted =
        parsedItem && parsedItem.filter((el) => el.productId !== id);
      window.localStorage.setItem(`${status}`, JSON.stringify(itemDeleted));
      return dispatch({
        type: DELETE_ORDERS,
        payload: { status: status, data: itemDeleted },
      });
    };
  }
}

export function getUserInfo() {
  return async function (dispatch) {
    const user = await axios.get("/user");
    return dispatch({
      type: GET_USER_INFO,
      payload: user.data,
    });
  };
}
export function getUsersInfo() {
  return async function (dispatch) {
    const users = await axios.get("/user/all");
    return dispatch({
      type: GET_USERS_INFO,
      payload: users.data,
    });
  };
}

export function deleteUserInfo(id) {
  return async function (dispatch) {
    const users = await axios.delete("/user/",  {
      data: { id: id }});
    return dispatch({
      type: DELETE_USER_INFO,
      payload: users.data,
    });
  };
}

export function deleteUserAdmin(id) {
  return async function (dispatch) {
    const users = await axios.delete("/user/admin",  {
      data: { id: id }});
    return dispatch({
      type: DELETE_USER_ADMIN,
      payload: users.data,
    });
  };
}

export function putUserInfo(body) {
  return async (dispatch) => {
    try {
      const userChangeData = await axios.put("/user", body);
      return dispatch({
        type: PUT_USER_INFO,
        payload: userChangeData.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
export function putUserAdmin(body) {
  return async (dispatch) => {
    try {
      const userChangeData = await axios.put('/user/admin', body);
      return dispatch({
        type: PUT_USER_ADMIN,
        payload: userChangeData.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function postDirectionUser(body) {
  return async (dispatch) => {
    try {
      const newAdress = await axios.post("/user/direction", body);
      return dispatch({
        type: POST_NEW_ADRESS_USER,
        payload: newAdress.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteAdressUser(id) {
  return async (dispatch) => {
    try {
      const deleteDirection = await axios.delete(`/user/direction/${id}`);
      return dispatch({
        type: DELETE_ADRESS_USER,
        payload: deleteDirection.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function getSales() {
  return async function (dispatch) {
    var json = await axios.get("/sale");
    return dispatch({
      type: GET_SALES,
      payload: json.data,
    });
  };
}

export function postSale(body) {
  return async function (dispatch) {
    var json = await axios.post("/sale", body);
  };
}

export function editSale(body) {
  return async function (dispatch) {
    var json = await axios.put("/sale", body);
  };
}

export function deleteSale(id) {
  return async function (dispatch) {
    var json = await axios.delete("/sale?saleId=" + id);
    return dispatch({
      type: DELETE_SALE,
      payload: json.data,
    });
  };
}

export function getAllProductsForSales() {
  return async function (dispatch) {
    var json = await axios.get("/products?limit=1000");
    return dispatch({
      type: GET_PRODUCTS_SALES,
      payload: json.data,
    });
  };
}

export function clearTokensUser() {
  return {
    type: CLEAR_TOKENS_USER,
  };
}

export function clearProductDetail() {
  return {
    type: CLEAR_PRODUCT_DETAIL,
  };
}

export function clearProductAndCategory() {
  return {
    type: CLEAR_PRODUCT_AND_CATEGORY,
  };
}

export function clearUserEmail() {
  return {
    type: CLEAR_USER_EMAIL,
  };
}

export function clearCarrusel() {
  return {
    type: CLEAR_CARRUSEL,
  };
}

export function postBulkOrder(orderIds) {
  return async function (dispatch) {
    const bulk = await axios.post("/order/bulk", orderIds);
    return dispatch({
      type: POST_BULK_ORDER,
      payload: bulk.data,
    });
  };
}

export function getBulkOrders(status) {
  console.log(status)
  return async function (dispatch) {
    const bulkOrders = await axios.get("/order/bulk?status=" + status.status);
    return dispatch({
      type: GET_BULK_ORDERS,
      payload: bulkOrders.data,
    });
  };
}


export function putBulkOrders(body,id) {
  return async function (dispatch) {
    const putBulkOrders = await axios.put("/order/bulk/" + id, body);
    return dispatch({
      type: PUT_BULK_ORDERS,
      payload: putBulkOrders.data,
    });
  };
}
