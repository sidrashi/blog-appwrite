import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import  aniloader  from "../assets/aniloader.gif";
import {Container} from "./index"

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    return () => {
      setLoader(false);
    };
  }, [navigate, authStatus, authentication]);

  return loader ? <Container> <img className="mx-auto" src={aniloader} alt="Loading..." /> </Container> : <> {children}</>;
}

export default AuthLayout;
