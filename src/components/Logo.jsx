import logo from "../assets/logo.png"

function Logo({ width = "100px" }) {
  return <div style={{width}}>
    <img src={logo} alt="logo" />
  </div>;
}

export default Logo;
