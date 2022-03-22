import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, postProduct } from "../Redux/Actions/actions";
import { validation } from "./validation";
import ButtonBuy from "./commons/ButtonBuy";
import check from "./utils/check-shield-regular-24.png";
import Modelo from "./utils/modelo.jpg";
import mas from "./utils/image-add-regular-24.png";
import OpenFile from "../components/commons/OpenFile";

export default function CreateProducts() {
  const dispatch = useDispatch();
  const allCategories = useSelector((e) => e.home.categories);

  const [inputImages, setInputImages] = useState("");
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState({
    title: "",
    name: "",
    price: "",
    shippingCost: "",
    description: "",
    images: [],
    stock: "",
    categories: [],
  });
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  function handleSubmit(e) {
    e.preventDefault();
    let crear = {
      title: input.title,
      name: input.name,
      price: input.price,
      shippingCost: input.shippingCost,
      description: input.description,
      images: input.images.join(", "),
      stock: input.stock,
      categories: input.categories.join(", "),
    };
    dispatch(postProduct(crear));
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
    console.log(crear);
    alert("Product Create!!");
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
    if (!input.categories.includes(e.target.value)) {
      setInput({
        ...input,
        categories: [...input.categories, e.target.value],
      });
    }
  }
  function addImage(e) {
    console.log(e.target.value);
    setInput({
      ...input,
      images: [...input.images, inputImages],
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
    e.preventDefault();

    setInput({
      ...input,
      images: input.images.filter((name) => name !== e.target.name),
    });
  }

  return (
    <>
      <NavBar />
      <div className="flex justify-center">
        <div className="flex bg-gray-50  min-w-min max-w-sm m-2 rounded-md justify-center p-8">
          <form>
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
                {allCategories &&
                  allCategories.map((e) => <option key={e}>{e}</option>)}
              </select>
              {input.categories.map((name) => {
                return (
                  <div className="flex w-full hover:bg-secondary-100 bg-gray-50">
                    <img src={check} alt="check" />
                    <button onClick={(name) => handleDelete(name)}>
                      {name}
                    </button>
                  </div>
                );
              })}

              <div className=" justify-center py-2 ">
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
                    onClick={(e) => addImage(e)}
                    className="cursor-pointer"
                    src={mas}
                  />
                </div>
                <h1>Otra forma</h1>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onchange={(e) => {
                      OpenFile(e);
                    }}
                  />
                  <br />
                  <img id="output" style="height:100px; width:100px;"></img>
                </div>
                <div className="flex">
                  {input.images &&
                    input.images.map((name) => {
                      return (
                        <div className="flex border-2 border-primary-500  rounded-lg bg-gray-50">
                          <img
                            className="w-10 h-10 m-0.5 "
                            src={name}
                            alt={name}
                          />
                          <button
                            className="bg-primary-500 w-6 my-0.5  rounded-lg hover:bg-primary-400"
                            name={name}
                            onClick={(name) => handleDeleteImage(name)}
                          >
                            X
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <ButtonBuy
              text="Create Product"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            ></ButtonBuy>
          </form>
        </div>
        <div className="justify-center items-center w-6/12 m-8 sm:hidden lg:flex z-10 hidden">
          {input.images.length > 0 ? (
            <div>
              <img src={input.images[0]} />
            </div>
          ) : (
            <div>
              <img src={Modelo} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
