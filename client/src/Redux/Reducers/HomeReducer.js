import { GET_PRODUCTS, GET_CATEGORIES, SEARCH_PRODUCT } from "../Actions/types";

//Reducer de prueba, no hace nada

const initialState = {
  products: [], //estado con los productos como objetos
  categories: [], //estado con las categorias como strings
  currentPage: 0,
  totalPages: 0
};
export const HomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
        currentPage: action.payload.page,
        totalPages: action.payload.pages
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case SEARCH_PRODUCT:
      return {
        ...state,
        products: action.payload,
      };
    default:
      return state;
  }
};
