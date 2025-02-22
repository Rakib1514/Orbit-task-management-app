import PropTypes from "prop-types"
import { useContext } from "react"
import AuthContext from "../Provider/AuthContext"
import Auth from "../pages/Auth/Auth"
import Loading from "../components/Loading/Loading"

const SecurePage = ({ children }) => {
    const { user, loading } = useContext(AuthContext)

    if (loading) {
        return <Loading/>
    }

    if (!user) {
        return <Auth/>
    }

    if (user) {
        return children
    }
}

SecurePage.propTypes = {
    children: PropTypes.node,
}

export default SecurePage
