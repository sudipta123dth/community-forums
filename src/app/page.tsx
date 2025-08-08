"use client";

import AuthApi from "@/api/AuthApi";
import { apiErrorToast } from "@/helper/apiErrorToast";
import userModel from "@/interface/database/userModel";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdRestore } from "react-icons/md";


const authApi = new AuthApi()

// const userId = "efc464bb-4a27-4a73-ab7e-9a0f832f754f";
export default function Home() {
  const router = useRouter();

  const [captcha, setCaptcha] = useState({ captchaId: "", captchaImg: "" });
  const [togglePassword, setTogglePassword] = useState<'password' | 'text'>('password');

  useEffect(() => {
    authApi.getCaptcha().then((res) => {
      if (res.isSuccess) {
        setCaptcha({
          captchaId: res.result?.captchaId,
          captchaImg: res.result?.captchaImg,
        })
      }
    })
  }, [])

  const changeCaptcha = () => {
    authApi.getCaptcha().then((res) => {
      if (res.isSuccess) {
        setCaptcha({
          captchaId: res.result?.captchaId,
          captchaImg: res.result?.captchaImg,
        })
      }
    })
  }

  async function handelLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.target) {
      const formData = new FormData(e.currentTarget);
      const userId = formData.get("userId");
      const password = formData.get("password");
      const captchaCode = formData.get("captcha");

      const res = await authApi.login({
        userName: userId,
        password: password,
        userEnteredCaptchaCode: captchaCode,
        captchaId: captcha.captchaId,
      })
      if (res.isSuccess) {
        const { token } = res.result
        const user: userModel = jwtDecode(token);
        localStorage.setItem("token", token);
        router.replace(`/forum/${user.nameid}`);
      } else {
        apiErrorToast(res)
      }

    }

  }

  return (
    <section className="h-screen lg:h-fit my-auto lg:my-24 flex justify-center items-center">
      <div className="rounded-3xl shadow p-4 md:p-8 max-w-md bg-slate-50">
        <div className="w-full flex items-center flex-col mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 w-fit">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Please login to your account</p>
        </div>

        <form onSubmit={handelLogin} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor=""
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              name="userId"
              className="form-input w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none hover:border-gray-300 dark:hover:border-slate-500 bg-white/80 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor=""
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="flex gap-x-3 items-center">
              <input
                type={togglePassword}
                name="password"
                className="form-input w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none hover:border-gray-300 dark:hover:border-slate-500 bg-white/80 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button type="button" onClick={() => setTogglePassword((prev) => prev === 'password' ? 'text' : 'password')}
                className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center min-w-[52px] cursor-pointer"
              >
                <FaEye />
              </button>
            </div>
          </div>

          <div>
            {!!captcha.captchaImg && (
              <div className="rounded-xl h-[80px] w-full">
                <Image
                  src={captcha.captchaImg}
                  alt="captcha"
                  className="rounded-lg shadow-sm h-full object-cover"
                  width={400}
                  height={80}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full">
            <input
              id="captchaInput"
              type="text"
              name="captcha"
              className="form-input w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none hover:border-gray-300 dark:hover:border-slate-500 bg-white/80 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="button"
              onClick={changeCaptcha}
              className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center min-w-[52px] cursor-pointer"
            >
              <MdRestore />
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl uppercase tracking-wide text-sm cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </section>
  );
}
