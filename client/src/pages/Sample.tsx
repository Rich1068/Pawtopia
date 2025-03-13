import axios from "axios";
import { useEffect, useState } from "react";

const Sample = () => {
  const [text, setText] = useState<string>("");
  useEffect(() => {
    try {
      axios.post("http://localhost:8000/").then(({ data }) => {
        console.log(data);
        setText(data.message);
      });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <h1>{text}</h1>
    </>
  );
};

export default Sample;
