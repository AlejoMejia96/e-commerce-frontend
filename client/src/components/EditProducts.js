
import NavbarAdmin from './NavbarAdmin';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector} from "react-redux"
import { getProductByID, putProductByID } from '../Redux/Actions/actions';
import React, { useState, useEffect } from "react";
import { getCategories } from "../Redux/Actions/actions";
import { validation } from "./validation";
import ButtonCreate from "./commons/ButtonCreate";
import check from "./utils/check-shield-regular-24.png";
import Modelo from "./utils/modelo.jpg";
import mas from "./utils/image-add-regular-24.png";
import Slider from "./ProductDetails/Slider";
import NavBarEmpty from "./NavBarEmpty";
import Axios from "axios";
import { AiOutlineConsoleSql } from 'react-icons/ai';



export default function EditProducts() {
const { idProduct} = useParams();
const dispatch = useDispatch();
const product = useSelector((state) => state.productID.product);
const allCategories = useSelector((state) => state.home.categories);
const [errors, setErrors] = useState({});
const [newCategory, setNewCategory] = useState("");
const [inputImages, setInputImages] = useState("");


useEffect(() => {
        dispatch(getProductByID(idProduct));
        dispatch(getCategories())
      }, [dispatch]);

useEffect(()=> {
   setInput({ 
     title: product.title,
    name: product.name,
    price: product.price,
    shippingCost: product.shippingCost,
    description: product.description,
    images: product.images,
    stock: product.stock,
    categories: product.categories,})
},[product])

      const [input, setInput] = useState({
        title: product.title,
        name: product.name,
        price: product.price,
        shippingCost: product.shippingCost,
        description: product.description,
        images: product.images,
        stock: product.stock,
        categories: product.categories,
      });
      
    
  function handleSubmit(e) {
    e.preventDefault();
   
    dispatch(putProductByID(idProduct, input));
    setInput({
      title: "",
      name: "",
      price: "",
      shippingCost: "",
      description: "",
      images: [],
      stock: "",
      categories: [],
    });

    alert("Product Modified!!");
  }

  function handleAddCategory(e) {
    const { value } = e.target;
    setNewCategory(value);
  }
  function handleSubmitAddCategory(e) {
    e.preventDefault();
    if (newCategory !== "") {
      setInput({
        ...input,
        categories: [...input.categories, {name:newCategory, id:e.target.id}],
      });
      setNewCategory("");
    }
  }

  function handelChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validation({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  }

  function handleSelectCategories(e) {
    
    if(input.categories){
     
    if (!input.categories.includes(e.target.value)) {
      
      setInput({
        ...input,
        categories: [...input.categories, {name:e.target.value, id:e.target.id}],
      });
    }
  }
  }

  let arr = [];
  const uploadImage = (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
      formData.append("upload_preset", "ecommerce");
      const newAxios = Axios.create()
      newAxios.post(
        "https://api.cloudinary.com/v1_1/dmjbff5rm/image/upload",
        formData
      ).then((res) => {
        arr.push(res.data.secure_url);
        console.log(arr)
        setInput({
          ...input,
          images: [...input.images, {url:arr[0], alt:""}],
        });
      });
    }
  };

  function addImage(e) {
  
    setInput({
      ...input,
      images: [...input.images, {url:inputImages, alt:""}],
    });
    setInputImages("");
  }

   
  function handleDelete(e) {
    e.preventDefault();
    setInput({
      ...input,
      categories: input.categories.filter(
        (name) => name !== e.target.innerText
      ),
    });
  }

  function handleDeleteImage(e) {
console.log(e.target.name.url)
    e.preventDefault();
    setInput({
      ...input,
      images: input.images.flat().filter((name) => name.url !== e.target.name),
    });
  }

  const desc = input.description && input.description.split(".");
  const description2 = desc && desc.slice(0, -1);
if(product){
    return (
      <>
       <NavBarEmpty />
      <div className='grid sm:grid-cols-[13rem_minmax(200px,_1fr)]' >
      <NavbarAdmin />
      <div className="flex justify-center bg-secondary-100">
        <div className="flex justify-around p-2  w-full m-11">
          <div className="flex bg-gray-50  min-w-min max-w-sm m-2 rounded-md justify-center p-8">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <h2 className="justify-center">Create Product</h2>
              <div>
                <div className=" justify-center p-2 ">
                  <label>Title</label>
                  <br />
                  <input
                    className="rounded-md h-8 w-full hover:bg-secondary-100 border-2 border-gray-300 bg-gray-50"
                    type="text"
                    name="title"
                    value={input.title}
                    onChange={(e) => handelChange(e)}
                  />
                  <strong>{errors.title}</strong>
                </div>

                <div className=" justify-center p-2 ">
                  <label>Name</label>
                  <input
                    className="rounded-md h-8 w-full hover:bg-secondary-100 border-2 border-gray-300 bg-gray-50"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={(e) => handelChange(e)}
                  />
                  <strong>{errors.name}</strong>
                </div>

                <div className=" justify-center p-2 ">
                  <label>Price </label>
                  <input
                    className="rounded-md h-8 w-full hover:bg-secondary-100 border-2 border-gray-300 bg-gray-50"
                    type="text"
                    name="price"
                    placeholder="$ 000.00"
                    value={input.price}
                    onChange={(e) => handelChange(e)}
                  />
                  <strong>{errors.price}</strong>
                </div>

                <div className=" justify-center p-2 ">
                  <label>Shipping Cost</label>
                  <input
                    className="rounded-md h-8 w-full hover:bg-secondary-100 border-2 border-gray-300 bg-gray-50"
                    type="text"
                    name="shippingCost"
                    placeholder="$ 000.00"
                    value={input.shippingCost}
                    onChange={(e) => handelChange(e)}
                  />
                  <strong>{errors.shippingCost}</strong>
                </div>

                <div className=" justify-center p-2 ">
                  <label>Description</label>
                  <textarea
                    className="rounded-md h-8 w-full hover:bg-secondary-100 border-2 border-gray-300 bg-gray-50"
                    type="text"
                    name="description"
                    overflow="auto"
                    value={input.description}
                    onChange={(e) => handelChange(e)}
                  />
                  <strong>{errors.description}</strong>
                </div>

                <div className=" justify-center p-2 ">
                  <label>Stock</label>
                  <input
                    className="rounded-md h-8 w-full hover:bg-secondary-100 border-2 border-gray-300 bg-gray-50"
                    type="number"
                    name="stock"
                    value={input.stock}
                    onChange={(e) => handelChange(e)}
                  />
                </div>
              </div>

              <div className=" justify-center p-2 ">
                <label>Categories</label>
                <select
                  className="rounded-md h-8 w-full hover:bg-secondary-100 border-2 border-gray-300 bg-gray-50"
                  onChange={(e) => handleSelectCategories(e)}
                >
                  <option>Select</option>
                  {allCategories && allCategories.length > 0 &&
                    allCategories.map((e) => (
                      <option id={e.id} key={e.name}>{e.name}</option>
                    ))}
                </select>

                <div className="flex">
                  <input
                    className="rounded-md h-8 w-full hover:bg-secondary-100 border-2 border-gray-300 bg-gray-50"
                    type="text"
                    placeholder="Add Cartegory... "
                    name="categories"
                    value={newCategory}
                    onChange={(e) => {
                      handleAddCategory(e);
                    }}
                  />
                  <button
                    type="button"
                    className="text-secondary-200 bg-secondary-100 p-1 ml-1 rounded-md "
                    onClick={(e) => handleSubmitAddCategory(e)}
                  >
                    Add
                  </button>
                </div>

                {input.categories && input.categories.map((category) => {

                  return (
                    <div className="flex w-full hover:bg-secondary-100 bg-gray-50">
                      <img src={check} alt="check" />
                      <button id={category.name} onClick={(e) => handleDelete(e.target.id)}>
                        {category.name}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className=" justify-center py-2 m-2 ">
                <label>Images</label>
                <div className="flex">
                  <input
                    className="rounded-md h-9 w-full hover:[bg-secundary-200] border-2 border-gray-300 bg-gray-50"
                    type="text"
                    placeholder="URL..."
                    value={inputImages}
                    onChange={(e) => setInputImages(e.target.value)}
                  />
                  <img
                    className="cursor-pointer"
                    onClick={(e) => addImage(e)}
                    src={mas}
                    alt=""
                  />
                </div>
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      uploadImage(e.target.files);
                    }}
                  ></input>
                </div>
                <div className="flex">
                  {input.images &&
                    input.images.flat().map((name) => {
                      return (
                        <div className="flex border-2 border-primary-500  rounded-lg bg-gray-50">
                          <img
                            className="w-10 h-10 m-0.5 "
                            src={name.url}
                            alt={name.url}
                          />
                          <button
                            className="bg-primary-500 w-6 my-0.5  rounded-lg hover:bg-primary-400"
                            name={name.url}
                            onClick={(name) => handleDeleteImage(name)}
                          >
                            X
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
              <ButtonCreate
                text="Modific Product"
                type="submit"
               
              ></ButtonCreate>
            </form>
          </div>
          <div className="sm:hidden lg:flex z-10 hidden w-full">
            <div className="w-full p-2 bg-white rounded shadow-sm mx-6 my-2 ">
              <div className="p-2 border-b-[1px] border-b-primary-300 font-lora">
                <h2 className="2xl:text-2xl">{input.title}</h2>
              </div>
              <div className=" justify-center w-full sm:hidden lg:flex z-10 hidden">
                {input.images && input.images.length > 0 ? (
                  <div className="">
                  <Slider images={input.images.flat()} />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <img className=" w-8/12" src={Modelo} alt="" />
                  </div>
                )}
              </div>
              <div className="flex justify-between w-11/12 m-8 ">
                <div className="text-3xl font-bold text-primary-700 font-lora flex justify-center items-center">
                  <span>US$ {input.price}</span>
                </div>
                <button
                  className="rounded no-underline h-fit w-fit font-bold p-2 text-white bg-primary-400 font-lora hover:bg-primary-700 focus:bg-primary-700 pointer-events-none"
                  to={"/cart/:idUser"}
                >
                  ADD TO CART
                </button>
              </div>
              <div className="flex justify-center">
                <div className=" p-2 border-[1px] border-primary-300 rounded flex flex-col items-center w-1/2">
                  <h2 className="pb-2 border-b-[1px] border-b-primary-300 font-lora">
                    Description
                  </h2>
                  <div className="text-sm pt-2">
                    {desc &&  desc.map((el) => {
                        return description2.indexOf(el) % 2 === 0 ? (
                          <div className="p-2 bg-primary-200 rounded">
                            <p>{el}</p>
                          </div>
                        ) : (
                          <div className="p-2 rounded">
                            <p>{el}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div> 
    </>
            )
             }
    }
 