import "./Loading.css";
import Load from "../../assets/icon.gif";

const Loading = () => {
  return (
    <div className="loading">
      <img src={Load} alt="loading" />
    </div>
  );
};

export default Loading;
