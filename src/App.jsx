import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Properties from "./Pages/Properties";
import PropertyDetails from "./Pages/PropertyDetails";
import Booking from "./Pages/Booking";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import BookingSuccess from "./Pages/BookingSuccess";
import MyBookings from "./Pages/MyBookings";
import CreateProperty from "./Pages/CreateProperty";
import MyProperties from "./Pages/MyProperties";
import EditProperty from "./Pages/EditProperty";
import HostBookings from "./Pages/HostBookings";
import HostProfile from "./Pages/HostProfile";
import Footer from "./components/Footer";

import {
    Routes,
    Route
} from "react-router-dom";

function App() {

    return (
        <>
            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/properties"
                    element={<Properties />}
                />

                <Route
                    path="/properties/:id"
                    element={<PropertyDetails />}
                />

                <Route
                     path="/login"
                     element={<Login />}
                />

                <Route
                     path="/register"
                     element={<Register />}
                />

                <Route
                    path="/booking-success/:id"
                    element={<BookingSuccess />}
                />

                <Route
                    path="/bookings"
                    element={<MyBookings />}
                />

                <Route
                    path="/bookings/create"
                    element={<Booking />}
                />

            <Route
                path="/booking-success/:id"
                element={<BookingSuccess />}
            />

            <Route
                path="/bookings"
                element={<MyBookings />}
            />

            <Route
                path="/create-property"
                element={<CreateProperty />}
            />

            <Route
                path="/my-properties"
                element={<MyProperties />}
            />

            <Route
                path="/edit-property/:id"
                element={<EditProperty />}
            />

            <Route
                path="/host-bookings"
                element={<HostBookings />}
            />

            <Route
                path="/hosts/:hostId"
                element={<HostProfile />}
            />

            </Routes>

            <Footer />  
        </>
    );
}

export default App;