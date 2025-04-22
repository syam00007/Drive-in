import Carousel from "react-bootstrap/Carousel";
import a from '../Images/v.jpg';
import b from '../Images/x.jpg';
import c from '../Images/w.jpg';
import d from '../Images/z.jpg';

function ImageCarousel() {
  return (
    <Carousel>
      <Carousel.Item interval={1500}>
        <img className="d-block w-100" src={a} alt=""
          style={{ objectFit: "cover", height: "500px" }} />
        
      </Carousel.Item>
      <Carousel.Item interval={1500}>
        <img className="d-block w-100"
          src={b}
          alt=""
          style={{ objectFit: "cover", height: "500px" }}/>  
      </Carousel.Item>
      <Carousel.Item interval={1500}>
        <img
         className="d-block w-100" src={c} alt=""
          style={{ objectFit: "cover", height: "500px" }}/>      
      </Carousel.Item>
      <Carousel.Item interval={1500}>
        <img className="d-block w-100"src={d} alt=""
          style={{ objectFit: "cover", height: "500px" }} />
      </Carousel.Item>
    </Carousel>
  );
}

export default ImageCarousel;