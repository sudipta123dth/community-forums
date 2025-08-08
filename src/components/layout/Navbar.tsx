'use client'

import AuthApi from '@/api/AuthApi'
import { apiErrorToast } from '@/helper/apiErrorToast'
import toastNotify from '@/helper/toastNotify'
import userModel from '@/interface/database/userModel'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoIosLogOut } from "react-icons/io"
import ModalComp from '../utils/ModalComp'

const authApi = new AuthApi()

const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<userModel | null>(null);
    const [OpenProfile, setOpenProfile] = useState<boolean>(false)

    useEffect(() => {
        const jwt = localStorage.getItem('token')
        if (jwt) {
            const user: userModel = jwtDecode(jwt)
            setUser(user)
        } else {
            setUser(null)
        }
    }, [pathname])

    async function handelLogout() {
        const token = localStorage.getItem('token')
        if (token) {
            const res = await authApi.logoutUser(token)
            if (res.isSuccess) {
                setOpenProfile(false)
                toastNotify(res.result)
            } else {
                setOpenProfile(false)
                apiErrorToast(res)
            }
            localStorage.removeItem('token')
        }
        router.replace('/')
    }


    return (
        <>
            <nav className="hidden md:flex bg-gradient-to-r from-indigo-700 to-indigo-500 text-white shadow-lg font-sans">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-3xl font-black tracking-tight">ForumHub</div>

                    <div className="hidden md:flex space-x-6 text-lg font-medium">
                        {!!user?.nameid &&
                            <Link href={`/forum/${user?.nameid}`}>
                                <p className="hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
                                    Forum
                                </p>
                            </Link>
                        }
                        <Link href="/trending">
                            <p className="hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
                                Trending
                            </p>
                        </Link>
                        <Link href="/newPost">
                            <p className="hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
                                New Post
                            </p>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ?
                            <button onClick={() => setOpenProfile(true)} className="p-1 bg-white rounded-full cursor-pointer">
                                <Image src={`https://ui-avatars.com/api/?name=${user.FirstName}+${user.LastName}&background=random`} alt="userProfile" width={40} height={40} className="rounded-full overflow-hidden" />
                            </button> :
                            <>
                                {pathname !== '/' && <Link href='/' className=" rounded px-4 py-2 cursor-pointer bg-blue-100 text-blue-800 font-bold">
                                    Login
                                </Link>}
                            </>
                        }
                    </div>
                </div>
            </nav>
            {user &&
                <ModalComp
                    open={OpenProfile}
                    onClose={() => setOpenProfile(false)}
                    title="User Profile"
                    footerContent={
                        <button className="bg-blue-100 items-center px-4 py-2 rounded shadow flex gap-x-2 w-fit h-fit mt-4" onClick={handelLogout}>
                            <IoIosLogOut />
                            Log out
                        </button>
                    }
                >
                    <div>
                        {user && (
                            <>
                                <div className="flex w-full justify-between">
                                    <div className="flex gap-x-4 items-center">
                                        <Image src={`https://ui-avatars.com/api/?name=${user.FirstName}+${user.LastName}`} alt="userProfile" width={40} height={40} className="rounded-full overflow-hidden" />
                                        <p>{`${user.FirstName} ${user.LastName}`}</p>
                                    </div>
                                </div>
                                <p className="mt-2"><b className="text-danger">Email: </b>{`${user.email}`}</p>
                                <p className="mt-2"><b className="text-pr">Phone Number: </b>{`${user.Mobile}`}</p>
                            </>
                        )}
                    </div>
                </ModalComp>
            }
        </>
    )
}

export default Navbar