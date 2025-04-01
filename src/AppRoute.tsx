import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "./ui/Layout";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import App from "./App";
import ProductDetail from "./pages/ProductDetail";
import ScrollToTop from "./utils/scrollToTop";
import Cart from "./pages/Cart";
import Favorite from "./pages/Favorite";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Success from "./pages/Success";
import Order from "./pages/Order";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";

const AppLayout = () => {
    return(
        <Layout>
                <Outlet />
        </Layout>
    )
}


const router = createBrowserRouter([
    {
        path:'/',
        element:(
            <>
                <ScrollToTop />,
                <AppLayout />
            </>
        ),
        children: [
            {
                index:true,
                element: <App />
            },
            {
                path:'product',
                element: <Product />
            },
            {
                path:'product/detail/:id',
                element: <ProductDetail />
            },
            {
                path:'*',
                element: <NotFound />
            },
            {
                path:'/cart',
                element: <Cart />
            },
            {
                path:'/favorite',
                element: <Favorite />
            },
            {
                path:'/profile',
                element: <Profile />
            },
            {
                path:'/success',
                element: <Success />
            },
            {
                path:'/orders',
                element: <Order />
            },
            {
                path:'/profile/edit',
                element: <EditProfile />
            },
            {
                path:'/profile/change-password',
                element: <ChangePassword />
            },
        ]
    },
    {
        path:'/register',
        element: <Registration />
    },
    {
        path:'/login',
        element: <Login />
    },
    {
        path:'/reset-password',
        element: <ResetPassword />
    }
])

export default router

