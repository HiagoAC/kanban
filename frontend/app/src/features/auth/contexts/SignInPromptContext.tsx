import { createContext, type ReactNode, useContext, useState } from "react";

export const SignInPromptContext = createContext({
	open: false,
	showPrompt: () => {},
	hidePrompt: () => {},
});

export function SignInPromptProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	return (
		<SignInPromptContext.Provider
			value={{
				open,
				showPrompt: () => setOpen(true),
				hidePrompt: () => setOpen(false),
			}}
		>
			{children}
		</SignInPromptContext.Provider>
	);
}

export const useSignInPrompt = () => useContext(SignInPromptContext);

// // In App.tsx or a layout component
// import { SignInPromptProvider, useSignInPrompt } from "./SignInPromptContext";
// function App() {
//   const { open, hidePrompt } = useSignInPrompt();
//   return (
//     <>
//       {/* ...other app code... */}
//       <SignInPrompt open={open} handleClose={hidePrompt} />
//     </>
//   );
// }

// // In your mutation hook/component
// import { useSignInPrompt } from "./SignInPromptContext";
// import { SignInPrompt } from "../components/SignInPrompt";
// const { showPrompt } = useSignInPrompt();
// onSuccess: () => {
//   if (isGuest) showPrompt();
// }
