import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { userInfoState } from "../stores/auth";
import axios from "axios";
import { fetchLogin } from "../Api/AuthApi";

export const AUTH_KEY = "AUTH_USER";

const Login = () => {
  const navigate = useNavigate();
  const baseUrl = "http://localhost:3001/api/users/login";
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [state, setState] = useState({
    userEmail: "",
    userPassword: "",
  });

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onClickLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchLogin(state);
      const user = response.data;
      if (user.token) {
        setUserInfo(user);
        console.log(user);
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
        navigate("/main");
      } else {
        alert("Error logging in");
      }
    } catch (error) {
      console.error(error);
      alert("로그인이 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 to-green-100">
      <div className="max-w-md p-10 mx-auto bg-white rounded-lg shadow-xl w-max">
        <img
          className="mx-auto rounded-full shadow-lg h-60"
          src="https://www.nizform.com/ByStoreFile/105073/preview/view_105073.jpg"
          alt="Your Company"
        />
        <h2 className="mt-6 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400">
          로그인
        </h2>

        <form className="mt-8 space-y-6" onSubmit={onClickLogin}>
          <div className="rounded-md shadow-sm">
            <div>
              <input
                id="userEmail"
                name="userEmail"
                type="userEmail"
                autoComplete="userEmail"
                required
                className="relative block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
                placeholder="이메일 주소"
                value={state.userEmail}
                onChange={handleChangeState}
              />
            </div>
            <div className="mt-4">
              <input
                id="userPassword"
                name="userPassword"
                type="password"
                autoComplete="current-userPassword"
                required
                className="relative block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="비밀번호"
                value={state.userPassword}
                onChange={handleChangeState}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              취소
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 text-sm font-bold text-white bg-yellow-400 border border-transparent rounded-md shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              로그인
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/signup"
            className="font-medium text-green-400 hover:text-green-300"
          >
            계정이 없으신가요? 가입하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
