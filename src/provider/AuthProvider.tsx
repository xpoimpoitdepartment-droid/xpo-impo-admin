"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/featured/auth/authSlice";

type Props = {
  children: ReactNode;
};

function SessionSyncComponent({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(setUser({
            user: data.data,
            accessToken: token
          }));
        }
      })
      .catch(error => {
        console.error('Failed to fetch user data:', error);
      });
    }
  }, []); // Run only once on mount

  return <>{children}</>;
}

export const AuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <SessionSyncComponent>{children}</SessionSyncComponent>
    </SessionProvider>
  );
};
