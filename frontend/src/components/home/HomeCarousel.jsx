import { HOME_STYLES, HOME_MESSAGES } from '../../constants/homeConstants.jsx'

const HomeCarousel = ({
  slides,
  currentSlide,
  onNextSlide,
  onPrevSlide,
  onGoToSlide
}) => {
  return (
    <div className={HOME_STYLES.carousel.container}>
      <div className={HOME_STYLES.carousel.slide}>
        <div>
          <h1 className={HOME_STYLES.carousel.title}>
            {slides[currentSlide]?.title}
          </h1>
          <p className={HOME_STYLES.carousel.subtitle}>
            {slides[currentSlide]?.subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={onPrevSlide}
        className={`${HOME_STYLES.carousel.button} ${HOME_STYLES.carousel.prevButton}`}
        title={HOME_MESSAGES.carousel.prevSlide}
      >
        &#8249;
      </button>

      <button
        onClick={onNextSlide}
        className={`${HOME_STYLES.carousel.button} ${HOME_STYLES.carousel.nextButton}`}
        title={HOME_MESSAGES.carousel.nextSlide}
      >
        &#8250;
      </button>

      <div className={HOME_STYLES.carousel.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onGoToSlide(index)}
            className={`${HOME_STYLES.carousel.indicator} ${
              index === currentSlide ? HOME_STYLES.carousel.indicatorActive : ''
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HomeCarousel