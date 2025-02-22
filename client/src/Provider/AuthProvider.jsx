import { useEffect, useState } from "react"
import AuthContext from "./AuthContext"
import PropTypes from "prop-types"
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import auth from "../../firebase.config"

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const googleProvider = new GoogleAuthProvider()

    // Sign in with Google
    const signInWithGoogle = async () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const userSignOut = async () => {
        setLoading(true)
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const authInfo = {
        user,
        signInWithGoogle,
        loading,
        setLoading,
        userSignOut,
    }

    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AuthProvider
