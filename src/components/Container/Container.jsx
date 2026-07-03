
function Container({ children, className = "" }) {
  return <div className={`w-full mx-auto max-w-7xl px-4 ${className}`}>{children}</div>;
}

export default Container;
