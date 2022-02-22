import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const ApiImage = () => {
  const [img, setImg] = useState([]);

  useEffect(() => {
    const fetchImg = async () => {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?page=3&query=office&client_id=FGLrtBfe9YRC2wu6NRCdfMz7L6NN8cf2boQNO9hX5kI`
      );
      console.log(res.data.results);
      setImg(res.data.results);
    };
    fetchImg();
    console.log("Rendered");
  }, []);
  return (
    <div className="photos">
      <button>Change background</button>
      <div className="img-container">
        {img.map((i) => (
          <img src={i.urls.small} key={i.id} />
        ))}
      </div>
    </div>
  );
};

export default ApiImage;
