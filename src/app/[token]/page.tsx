'use client'

import AuthApi from '@/api/AuthApi';
import userModel from '@/interface/database/userModel';
import { jwtDecode } from 'jwt-decode';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { validate as uuidValidate } from 'uuid';

const isValidJWT = (token: string): boolean => {
    try {
        // JWT has 3 parts separated by dots
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        // Check if each part is valid base64
        parts.forEach(part => {
            // Add padding if needed
            const padded = part + '='.repeat((4 - part.length % 4) % 4);
            atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const isValidUUID = (token: string): boolean => {
    return uuidValidate(token);
};

const authApi = new AuthApi()

const Page = () => {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const token = params.token as string;

        if (!token) {
            router.replace('/');
            return;
        }

        // Check if token is a valid UUID
        if (isValidUUID(token)) {
            router.replace(`/forum/${token}`);
            return;
        } else if (isValidJWT(token)) {
            // Check if token is a valid JWT
            authApi.validateToken(token)
                .then(res => {
                    if (res.isSuccess) {
                        localStorage.setItem('token', token);
                        const user: userModel = jwtDecode(token)
                        router.replace(`/forum/${user.nameid}`);
                    } else {
                        router.replace('/');
                    }
                })
                .catch(() => {
                    router.replace('/');
                });
            return;
        } else if (token === 'forum') {
            const jwt = localStorage.getItem('token')
            if (jwt) {
                const user: userModel = jwtDecode(jwt)
                router.replace(`/forum/${user.nameid}`)
            } else {
                router.replace('/')
            }
        } else {
            // If token is neither valid UUID nor JWT, redirect to login
            router.replace('/');
        }
    }, [params.token, router]);

    return (
        <div className="flex items-center justify-center my-auto p-4">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Validating...</p>
            </div>
        </div>
    )
}


export default Page