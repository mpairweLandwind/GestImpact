import { Suspense, useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import SignIn from "./components/SignForms/SignIn.jsx";
import SignUp from "./components/SignForms/SignUp.jsx";
import Admin from "./pages/Admin/Admin";
import Website from "./pages/Website";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Properties from "./pages/Properties/Properties";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Property from "./pages/Property/Property";
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
import PrivateRoute from "./components/PrivateRoute"; // For protected routes
import EditPropertyForm from "./components/EditPropertyForm/EditPropertyForm.jsx";

function App() {
  const queryClient = new QueryClient();

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
    token: null,
    email: "",
  });

  const isAuthenticated = !!userDetails.token;

  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Website />} />
                <Route path="/sign-in" element={isAuthenticated ? <Navigate to="/" /> : <SignIn />} />
                <Route path="/sign-up" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
                
                {/* Properties Routes */}
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:propertyId" element={<Property />} />
                <Route path="/properties/:propertyId/edit" element={isAuthenticated ? <EditPropertyForm /> : <Navigate to="/sign-in" />} />

                {/* Protected Routes */}
                <Route path="/managedProperties" element={isAuthenticated ? <Bookings /> : <Navigate to="/sign-in" />} />
                <Route path="/favourites" element={isAuthenticated ? <Favourites /> : <Navigate to="/sign-in" />} />

                {/* Admin (Protected Route) */}
                <Route path="/admin/*" element={<PrivateRoute element={<Admin />} />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </UserDetailContext.Provider>
  );
}

export default App;
