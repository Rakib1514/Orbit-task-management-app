import { useState, useEffect, useContext } from "react"
import AuthContext from "../../Provider/AuthContext"

const Navbar = () => {
    const [theme, setTheme] = useState("light")

    const { signInWithGoogle, user, setLoading, userSignOut } =
        useContext(AuthContext)

    useEffect(() => {
        // Check if a theme is already stored in localStorage
        const storedTheme = localStorage.getItem("theme")
        if (storedTheme) {
            setTheme(storedTheme)
            document.documentElement.setAttribute("data-theme", storedTheme)
        } else {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches
            const initialTheme = prefersDark ? "dark" : "light"
            setTheme(initialTheme)
            document.documentElement.setAttribute("data-theme", initialTheme)

            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            const handleChange = (e) => {
                const newTheme = e.matches ? "dark" : "light"
                setTheme(newTheme)
                document.documentElement.setAttribute("data-theme", newTheme)
            }

            mediaQuery.addEventListener("change", handleChange)
            return () => mediaQuery.removeEventListener("change", handleChange)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
        localStorage.setItem("theme", newTheme)
    }

    const handleSignIn = async () => {
        try {
            const result = await signInWithGoogle()
            if (result.user) {
                console.log(`helleo ${result.user.displayName}`)
            }
        } catch (error) {
            setLoading(false)
            console.error(error)
        } finally {
            // btn loading need to add
        }
    }

    const handleSignOut = async () => {
        try {
            await userSignOut()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <header>
            <nav className="container mx-auto flex items-center justify-between px-4 py-4">
                <p className="text-3xl font-semibold uppercase">orbit</p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSignIn}
                        className={`btn transition-scale flex cursor-pointer items-center gap-2 rounded-sm border border-gray-400 px-4 py-2 duration-200 hover:scale-[1.02] active:scale-100 dark:border-gray-600 ${user && "hidden"}`}
                    >
                        <svg
                            aria-label="Google logo"
                            width="16"
                            height="16"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <g>
                                <path d="m0 0H512V512H0" fill="#fff"></path>
                                <path
                                    fill="#34a853"
                                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                                ></path>
                                <path
                                    fill="#4285f4"
                                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                                ></path>
                                <path
                                    fill="#fbbc02"
                                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                                ></path>
                                <path
                                    fill="#ea4335"
                                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                                ></path>
                            </g>
                        </svg>
                        Login with Google
                    </button>
                    <p>{user && user.displayName}</p>
                    {user && (
                        <button
                            onClick={handleSignOut}
                            className="btn transition-scale flex cursor-pointer items-center gap-2 rounded-sm border border-gray-400 px-4 py-2 duration-200 hover:scale-[1.02] active:scale-100 dark:border-gray-600"
                        >
                            sign out
                        </button>
                    )}
                    <button onClick={toggleTheme}>
                        {/* Sun icon */}
                        <svg
                            className={`swap-on h-10 w-10 fill-current ${theme === "light" ? "hidden" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                        </svg>
                        {/* Moon icon*/}
                        <svg
                            className={`swap-off h-10 w-10 fill-current ${theme === "dark" ? "hidden" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
