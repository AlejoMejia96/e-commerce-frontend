import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../Redux/Actions/actions';
import { Link } from 'react-router-dom';

export default function LoginProfileButton() {
  const [logedIn, setLogedIn] = useState(false);
  const token = window.localStorage.getItem('access');
  const user = useSelector((state) => state.home.user);
  const [reRender, setReRender] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserInfo(token));
    if (token) {
      setLogedIn(true);
    } else {
      setLogedIn(false);
    }
  }, [token]);
  const handleLogOut = () => {
    window.localStorage.clear();
    setReRender({});
  };
  return (
    <div>
      {logedIn ? (
        <div className="group">
          <button className=" rounded-t-full w-10/10 px-2 py-2 group ">
            <div></div>
            <img
              src={user.profilePicture}
              className="relative object-cover w-11 h-11 border-4 border-secondary-100/0 rounded-full z-20 group-hover:border-secondary-100/100 "
            ></img>
            <ul className="absolute -ml-2 mt-1 rounded-lg  z-10 text-sm">
              <Link to="/user" className="no-underline text-black">
                <li className="rounded-t-md bg-secondary-100 p-1.5 z-10 translate-y-10  invisible group-hover:translate-x-0 group-hover:translate-y-0 group-hover:visible duration-100 ease-in hover:bg-primary-300 ">
                  Profile
                </li>
              </Link>
              <Link
                to="/"
                onClick={(e) => handleLogOut()}
                className="no-underline text-black"
              >
                <li className="rounded-b-md bg-secondary-100 p-1.5 z-10 translate-y-16  invisible group-hover:translate-x-0 group-hover:translate-y-0 group-hover:visible duration-150 ease-in hover:bg-primary-300">
                  Logout
                </li>
              </Link>
            </ul>
          </button>
        </div>
      ) : (
        <Link to="/login" className="no-underline text-black">
          <button className="bg-primary-700 font-small rounded-lg text-sm w-12/14 px-2 py-2 ">
            Log in / Sign up
          </button>
        </Link>
      )}
    </div>
  );
}