import '../productSlider/ProductSlider.css';
import ProductCard from '../productCard/ProductCard';
import { useRef } from 'react';

export default function ProductSlider({ products }) {
  const sliderRef = useRef(null);
  let scrollInterval = null;

  const startScroll = (direction) => {
    stopScroll();
    scrollInterval = setInterval(() => {
      sliderRef.current.scrollLeft += direction === "right" ? 2 : -2;
    }, 16); // ~60fps
  };

  const stopScroll = () => {
    if (scrollInterval) clearInterval(scrollInterval);
  };

  return (
    <div className="slider-wrapper">
      {/* Hover trái */}
      <div
        className="hover-zone left"
        onClick={() => startScroll("left")}
        onMouseLeave={stopScroll}
      />

      {/* Slider */}
      <div className="slider" ref={sliderRef}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Hover phải */}
      <div
        className="hover-zone right"
        onClick={() => startScroll("right")}
        onMouseLeave={stopScroll}
      />
    </div>
  );
}