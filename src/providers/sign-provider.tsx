import React, { Dispatch, createContext, useReducer } from "react";

type SignStateType = {
  signedIn: boolean | null;
  sig?: string;
  address?: string;
  ens?: string;
};

type SignActionType = {
  type: "SIGN_IN" | "SIGN_OUT";
  sig?: string;
  address?: string;
  ens?: string;
};

const initialSignData: SignStateType = {
  signedIn: null,
  sig: undefined,
  address: undefined,
  ens: undefined,
};

export const SignContext = createContext<SignStateType>(initialSignData);
export const SignDispatchContext = createContext<
  Dispatch<SignActionType> | undefined | null
>(undefined);

export const SignProvider = ({ children }: { children: React.ReactNode }) => {
  const [signs, dispatch] = useReducer(signReducer, initialSignData);

  return (
    <SignContext.Provider value={signs}>
      <SignDispatchContext.Provider value={dispatch}>
        {children}
      </SignDispatchContext.Provider>
    </SignContext.Provider>
  );
};

const signReducer = (state: SignStateType, action: SignActionType) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        signedIn: true,
        sig: action.sig,
        address: action.address,
        ens: action.ens,
      };
    case "SIGN_OUT":
      return {
        ...state,
        signedIn: false,
        sig: undefined,
        address: undefined,
        ens: undefined,
      };
    default:
      return state;
  }
};
