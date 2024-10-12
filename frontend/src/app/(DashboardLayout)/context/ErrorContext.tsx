import React, { createContext, useState, useEffect, ReactNode } from "react";
import dotenv from "dotenv";

interface Error {
  username: any;
  timestamp: string;
  errorData: {
    command: string;
    error: string;
  };
}

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorContext = createContext<Error[] | undefined>(undefined);

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    console.log(process.env);
    const fetchErrorData = async () => {
      try {
        const res = await fetch(`${process.env.API_URL}/errors`);
        if (!res.ok) {
          throw new Error("Failed to fetch error data");
        }
        const data = await res.json();
        setErrors(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchErrorData();
  }, []);

  return (
    <ErrorContext.Provider value={errors}>{children}</ErrorContext.Provider>
  );
};
