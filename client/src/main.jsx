import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router"
import PublicRoutes from "./routes/PublicRoutes"
import AuthProvider from "./Provider/AuthProvider"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <PublicRoutes />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)
