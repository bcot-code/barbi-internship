import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from "keen-slider/react";

const WheelControls = (slider) => {
  let touchTimeout
  let position
  let wheelActive

  function dispatch(e, name) {
    position.x -= e.deltaX
    position.y -= e.deltaY
    slider.container.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          x: position.x,
          y: position.y,
        },
      })
    )
  }

  function wheelStart(e) {
    position = {
      x: e.pageX,
      y: e.pageY,
    }
    dispatch(e, "ksDragStart")
  }

  function wheel(e) {
    dispatch(e, "ksDrag")
  }

  function wheelEnd(e) {
    dispatch(e, "ksDragEnd")
  }

  function eventWheel(e) {
    // Only prevent default and handle wheel if slider can still scroll
    if (slider.track.details.maxPos || slider.track.details.minPos !== 0) {
      e.preventDefault()
      if (!wheelActive) {
        wheelStart(e)
        wheelActive = true
      }
      wheel(e)
      clearTimeout(touchTimeout)
      touchTimeout = setTimeout(() => {
        wheelActive = false
        wheelEnd(e)
      }, 50)
    }
    // If slider can't scroll further, let the event pass through for page scrolling
  }

  slider.on("created", () => {
    slider.container.addEventListener("wheel", eventWheel, {
      passive: false,
    })
  })
}

const HotCollections = () => {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 4, 
        spacing: 15,
      },
      rubberband: true, // smooth elastic scrolling effect
      //mobile view for the showing few slides
      breakpoints: {
        "(max-width: 991px)": {
          slides: {
            perView: 2,
            spacing: 15,
          },
        },
        "(max-width: 575px)": {
          slides: {
            perView: 1,
            spacing: 15,
          },
        },
      },
    },
    [
      // add plugins here
      WheelControls
    ]
  )
  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <div ref={sliderRef} className="keen-slider" style={{overflow: 'visible'}}>
              {new Array(4).fill(0).map((_, index) => (
                <div className="keen-slider__slide" style={{minWidth: '25%'}} key={index}>
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to="/item-details">
                        <img src={nftImage} className="lazy img-fluid" alt="" />
                      </Link>
                    </div>
                    <div className="nft_coll_pp">
                      <Link to="/author">
                        <img className="lazy pp-coll" src={AuthorImage} alt="" />
                      </Link>
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="nft_coll_info">
                      <Link to="/explore">
                        <h4>Pinky Ocean</h4>
                      </Link>
                      <span>ERC-192</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
