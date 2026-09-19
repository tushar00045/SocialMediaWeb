import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AuthLayout({ children, authentication = true }) {

    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);

    const authStatus = useSelector(
        (state) => state.auth.status
    );

    useEffect(() => {

        // Page requires login, but user is NOT logged in
        if (authentication && !authStatus) {
            navigate("/login");
            return;
        }

        // Page is for logged-out users, but user IS logged in
        if (!authentication && authStatus) {
            navigate("/");
            return;
        }

        setLoader(false);

    }, [authStatus, navigate, authentication]);

    return loader ? (
        <h1>Loading....</h1>
    ) : (
        <>{children}</>
    );
}

export default AuthLayout;