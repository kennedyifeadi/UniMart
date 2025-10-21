import { useState, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CarouselProps {
  children: React.ReactNode[];
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
}

export const Carousel = ({ 
  children, 
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true 
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
    );
  }, [children.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isHovered && autoPlayInterval > 0) {
      const intervalId = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(intervalId);
    }
  }, [isHovered, autoPlayInterval, goToNext]);

  return (
    <div 
      className="relative w-full mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Content */}
      <div className="overflow-hidden relative">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="min-w-full flex justify-center">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && children.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:translate-x-52 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:-translate-x-52 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && children.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 h-3 bg-blue-600' 
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
