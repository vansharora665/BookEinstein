import "./loader.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="app-loader">
      <img src="/loader.gif" alt="Loading" />
      {text && <p>{text}</p>}
    </div>
  );
}
