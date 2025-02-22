import Navbar from "../../components/Navbar/Navbar"

const Auth = () => {
    return (
        <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen">
            <Navbar />
            <div className="flex justify-center items-center ">
              <p className="text-3xl font-semibold">Please SIgn In to continue</p>
            </div>
        </div>
    )
}

export default Auth
