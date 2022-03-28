import axios from 'axios';
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
  GET_SALES,
  GET_PRODUCTS_SALES,
} from './types';
import { requestInterceptor, responseInterceptor } from './interceptors.js';
requestInterceptor();
responseInterceptor();

// action para traer los productos
export function getProducts(search) {
  return async function (dispatch) {
    var json = await axios.get(`http://localhost:3001/products${search}`);

    return dispatch({
      type: GET_PRODUCTS,
      payload: json.data,
    });
  };
}

//action para traer las categorias
export function getCategories() {
  return async function (dispatch) {
    var json = await axios.get('http://localhost:3001/categories');
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
      var json = await axios.get('http://localhost:3001/products/' + id);
      return dispatch({
        type: GET_PRODUCT_BY_ID,
        payload: json.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function putProductByID(id) {
  return async function (dispatch) {
    try {
      var json = await axios.put('http://localhost:3001/products/' + id);
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
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  return async function () {
    try {
      const commentUpdated = await axios.put('http://localhost:3001/comment', comment, {
        headers: headers,
      });
      return commentUpdated;
    } catch (error) {
      console.log(error);
    }
  };
}

export function postComment(comment, token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  return async function () {
    try {
      const commentCreated = await axios.post('http://localhost:3001/comment', comment, {
        headers: headers,
      });
      return commentCreated;
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteComment(id, token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  return async function () {
    try {
      const commentDeleted = await axios.delete('http://localhost:3001/comment', {
        data: { id: id },
        headers: headers,
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
      var json = await axios.get(`http://localhost:3001/comment/?productId=${id}`);
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
      const products = await axios.get(
        `http://localhost:3001/products?limit=100&search=${query}`
      );
      const categories = await axios.get(
        `http://localhost:3001/categories?search=${query}`
      );
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
    const create = await axios.post('http://localhost:3001/products', product);
    return create;
  };
}

export function postNewUser(obj) {
  return async function (dispatch) {
    const user = await axios.post('http://localhost:3001/user', obj);
    return dispatch({
      type: POST_NEWUSER,
      payload: user.data,
    });
  };
}

export function loginUser(val) {
  return async function (dispatch) {
    const login = await axios.post('http://localhost:3001/user/login', val);
    return dispatch({
      type: LOGIN_USER,
      payload: login.data,
    });
  };
}

export function validateMail(mail) {
  return async function (dispatch) {
    const validate = await axios.post('http://localhost:3001/user/email', mail);
    return dispatch({
      type: VALIDATE_MAIL,
      payload: validate.data,
    });
  };
}

export function postOrder(order){
  const token = window.localStorage.getItem('access')
  const headers ={
    "Authorization": `Bearer ${token}`
  };

  return (dispatch) => {
    try {
      
      return axios.
      post("http://localhost:3001/order", order, {headers: headers})
        .then((res) => {
          dispatch({
            type: POST_ORDERS,
            payload: {status: order.status, data: res.data},
          });
        })
        .catch((error) => {
          if (error.response.status === 403) {
            let refreshToken = window.localStorage.getItem('refresh');
            axios
              .post('http://localhost:3001/user/token', { token: refreshToken })
              .then((res) => {
                window.localStorage.setItem('access', res.data.token);
                axios
                  .post('http://localhost:3001/order',order, {
                    headers: {
                      'Authorization': `Bearer ${res.data.token}`,
                    },
                  })
                  .then((res) => {
                    dispatch({
                      type: POST_ORDERS,
                      payload: {status: order.status, data: res.data},
                    });
                  });
              });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
}

export function postOrderFav(order) {
  return async function (dispatch) {
    const order = await axios.post('http://localhost:3001/order', order);
    return dispatch({
      type: POST_ORDERS_FAV,
      payload: order.data,
    });
  };
  //   const token = window.localStorage.getItem('access');
  //   const headers = {
  //     'Authorization': `Bearer ${token}`,
  //   };

  //   return (dispatch) => {
  //     try {
  //       return axios
  //         .post('http://localhost:3001/order', order, { headers: headers })
  //         .then((res) => {
  //           dispatch({
  //             type: POST_ORDERS_FAV,
  //             payload: res.data,
  //           });
  //         })
  //         .catch((error) => {
  //           if (error.response.status === 403) {
  //             let refreshToken = window.localStorage.getItem('refresh');
  //             axios
  //               .post('http://localhost:3001/user/token', { token: refreshToken })
  //               .then((res) => {
  //                 window.localStorage.setItem('access', res.data.token);
  //                 axios
  //                   .post('http://localhost:3001/order', order, {
  //                     headers: {
  //                       'Authorization': `Bearer ${res.data.token}`,
  //                     },
  //                   })
  //                   .then((res) => {
  //                     dispatch({
  //                       type: POST_ORDERS_FAV,
  //                       payload: res.data,
  //                     });
  //                   });
  //               });
  //           }
  //         });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
}

// para llamar cart y whislist -finali -proces
export function getOrder(order) {
  return async function (dispatch) {
    const order = await axios.get('http://localhost:3001/order?status=' + order.status);
    return dispatch({
      type: GET_ORDERS,
      payload: order.data,
    });
  };
  // const token = window.localStorage.getItem('access');
  // const headers = {
  //   'Authorization': `Bearer ${token}`,
  // };
  // return (dispatch) => {
  //   try {
  //     return axios
  //       .get('http://localhost:3001/order?status=' + order.status, { headers: headers })
  //       .then((res) => {
  //         dispatch({
  //           type: GET_ORDERS,
  //           payload: res.data,
  //         });
  //       })
  //       .catch((error) => {
  //         if (error.response.status === 403) {
  //           let refreshToken = window.localStorage.getItem('refresh');
  //           axios
  //             .post('http://localhost:3001/order', { token: refreshToken })
  //             .then((res) => {
  //               window.localStorage.setItem('access', res.data.token);
  //               axios
  //                 .get('http://localhost:3001/order', {
  //                   headers: {
  //                     'Authorization': `Bearer ${res.data.token}`,
  //                   },
  //                 })
  //                 .then((res) => {
  //                   dispatch({
  //                     type: GET_ORDERS,
  //                     payload: res.data,
  //                   });
  //                 });
  //             });
  //         }
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
}

export function getOrderFavs(order) {
  return async function (dispatch) {
    const order = await axios.get('http://localhost:3001/order?status=' + order.status);
    return dispatch({
      type: GET_ORDERS_FAVS,
      payload: order.data,
    });
  };
  // const token = window.localStorage.getItem('access');
  // const headers = {
  //   'Authorization': `Bearer ${token}`,
  // };
  // return (dispatch) => {
  //   try {
  //     return axios
  //       .get('http://localhost:3001/order?status=' + order.status, { headers: headers })
  //       .then((res) => {
  //         dispatch({
  //           type: GET_ORDERS_FAVS,
  //           payload: res.data,
  //         });
  //       })
  //       .catch((error) => {
  //         if (error.response.status === 403) {
  //           let refreshToken = window.localStorage.getItem('refresh');
  //           axios
  //             .post('http://localhost:3001/order', { token: refreshToken })
  //             .then((res) => {
  //               window.localStorage.setItem('access', res.data.token);
  //               axios
  //                 .get('http://localhost:3001/order', {
  //                   headers: {
  //                     'Authorization': `Bearer ${res.data.token}`,
  //                   },
  //                 })
  //                 .then((res) => {
  //                   dispatch({
  //                     type: GET_ORDERS_FAVS,
  //                     payload: res.data,
  //                   });
  //                 });
  //             });
  //         }
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
}

  export function getOrder(order) {
    const token = window.localStorage.getItem('access')
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    return (dispatch) => {
      try {
        return  axios.get('http://localhost:3001/order?status='+ order.status, { headers: headers })
        .then(res=> {
          dispatch({
            type: GET_ORDERS,
            payload: {status: order.status, data: res.data},
            
          });
        }) 
      .catch ((error) => {
        if(error.response.status === 403){
          let refreshToken = window.localStorage.getItem('refresh');
          axios
            .post('http://localhost:3001/order', { token: refreshToken })
            .then((res) => {
              window.localStorage.setItem('access', res.data.token);
                axios
                  .get('http://localhost:3001/order', {
                    headers: {
                      'Authorization': `Bearer ${res.data.token}`,
                    },
                  })
                  .then((res) => {
                    dispatch({
                      type: GET_ORDERS,
                      payload: {status: order.status, data: res.data},
                    });
                  });
            });
          }
        })
      } catch(error){
        console.log(error);
      }
    };
  } 

    export function deleteOrder(order){
      const token = window.localStorage.getItem('access')
      const headers ={
        "Authorization": `Bearer ${token}`
      };
      return (dispatch) => {
        try {
        
          return axios
          .delete(`http://localhost:3001/order/${order}`, {headers: headers})
            .then((res) => {
              dispatch({
                type: DELETE_ORDERS,
                payload: res.data,
              });
            })
            .catch((error) => {
              if (error.response.status === 403) {
                let refreshToken = window.localStorage.getItem('refresh');
                axios
                  .post('http://localhost:3001/user/token', { token: refreshToken })
                  .then((res) => {
                    window.localStorage.setItem('access', res.data.token);
                    axios
                      .delete(`http://localhost:3001/order${order}`, {
                        headers: {
                          'Authorization': `Bearer ${res.data.token}`,
                        },
                      })
                      .then((res) => {
                        dispatch({
                          type: DELETE_ORDERS,
                          payload: res.data,
                        });
                      });
                  });
              }
            });
        } catch (error) {
          console.log(error);
        }
      };
    }
    

export function getUserInfo() {
  return async function (dispatch) {
    const user = await axios.get('http://localhost:3001/user');
    return dispatch({
      type: GET_USER_INFO,
      payload: user.data,
    });
  };
  // const headers = {
  //   'Authorization': `Bearer ${token}`,
  // };
  // return (dispatch) => {
  //   try {
  //     return axios
  //       .get('http://localhost:3001/user', { headers: headers })
  //       .then((res) => {
  //         dispatch({
  //           type: GET_USER_INFO,
  //           payload: res.data,
  //         });
  //       })
  //       .catch((error) => {
  //         if (error.response.status === 403) {
  //           let refreshToken = window.localStorage.getItem('refresh');
  //           axios
  //             .post('http://localhost:3001/user/token', { token: refreshToken })
  //             .then((res) => {
  //               window.localStorage.setItem('access', res.data.token);
  //               axios
  //                 .get('http://localhost:3001/user', {
  //                   headers: {
  //                     'Authorization': `Bearer ${res.data.token}`,
  //                   },
  //                 })
  //                 .then((res) => {
  //                   dispatch({
  //                     type: GET_USER_INFO,
  //                     payload: res.data,
  //                   });
  //                 });
  //             });
  //         }
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
}





export function putUserInfo(token, body) {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  console.log(body);

  return async (dispatch) => {
    try {
      const userChangeData = await axios.put('http://localhost:3001/user', body, {
        headers: headers,
      });
      return dispatch({
        type: PUT_USER_INFO,
        payload: userChangeData.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function getSales() {
  return async function (dispatch) {
    var json = await axios.get('http://localhost:3001/sale');
    return dispatch({
      type: GET_SALES,
      payload: json.data,
    });
  };
}
export function postSale(body) {
  const token = window.localStorage.getItem('access');
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  return (dispatch) => {
    try {
      return axios
        .post('http://localhost:3001/sale', body, { headers: headers })
        .catch((error) => {
          if (error.response.status === 403) {
            let refreshToken = window.localStorage.getItem('refresh');
            axios
              .post('http://localhost:3001/user/token', { token: refreshToken })
              .then((res) => {
                window.localStorage.setItem('access', res.data.token);
                axios.post('http://localhost:3001/sale', body, {
                  headers: {
                    'Authorization': `Bearer ${res.data.token}`,
                  },
                });
              });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
}

export function editSale(body) {
  const token = window.localStorage.getItem('access');
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  return (dispatch) => {
    try {
      return axios
        .put('http://localhost:3001/sale', body, { headers: headers })
        .catch((error) => {
          if (error.response.status === 403) {
            let refreshToken = window.localStorage.getItem('refresh');
            axios
              .post('http://localhost:3001/user/token', { token: refreshToken })
              .then((res) => {
                window.localStorage.setItem('access', res.data.token);
                axios.put('http://localhost:3001/sale', body, {
                  headers: {
                    'Authorization': `Bearer ${res.data.token}`,
                  },
                });
              });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
}
export function deleteSale(id) {
  const token = window.localStorage.getItem('access');
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  return (dispatch) => {
    try {
      return axios
        .delete('http://localhost:3001/sale?saleId=' + id, { headers: headers })
        .catch((error) => {
          if (error.response.status === 403) {
            let refreshToken = window.localStorage.getItem('refresh');
            axios
              .post('http://localhost:3001/user/token', { token: refreshToken })
              .then((res) => {
                window.localStorage.setItem('access', res.data.token);
                axios.delete('http://localhost:3001/sale?saleId=' + id, {
                  headers: {
                    'Authorization': `Bearer ${res.data.token}`,
                  },
                });
              }); 
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
}

export function getAllProductsForSales() {
  return async function (dispatch) {
    var json = await axios.get('http://localhost:3001/products?limit=1000');
    return dispatch({
      type: GET_PRODUCTS_SALES,
      payload: json.data,
    });
  };
}
