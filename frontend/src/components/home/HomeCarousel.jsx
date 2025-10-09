import { HOME_STYLES, HOME_MESSAGES } from '../../constants/homeConstants.jsx'

const HomeCarousel = ({
  slides,
  currentSlide,
  onNextSlide,
  onPrevSlide,
  onGoToSlide
}) => {
  const currentSlideData = slides[currentSlide]

  return (
    <div className={HOME_STYLES.carousel.container}>
      <div
        className={HOME_STYLES.carousel.slide}
        style={{
          backgroundImage: currentSlideData?.image
            ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentSlideData.image})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div>
          <h1 className={HOME_STYLES.carousel.title}>
            {currentSlideData?.title}
          </h1>
          <p className={HOME_STYLES.carousel.subtitle}>
            {currentSlideData?.subtitle}
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