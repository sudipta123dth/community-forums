"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function useToken() {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token") ?? "";
      setToken(storedToken);
    }
  }, [pathname]);

  const removeToken = () => {
    if (typeof window !== "undefined") {
      Swal.fire({
        title: "Attention !!",
        text: "Your session has expired or you’ve logged out. To access this feature, you need to be logged in. Would you like to go to the login page?",
        confirmButtonText: "Yes, Login",
        showDenyButton: true,
        denyButtonText: "Never mind",
      }).then((res) => {
        setToken("");
        localStorage.removeItem("token");
        if (res.isConfirmed) {
          router.replace("/");
        }
      });
    }
  };

  return { jwtToken: token, removeToken };
}
