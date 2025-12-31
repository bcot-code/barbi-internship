import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from "keen-slider/react";
import Skeleton from "../UI/Skeleton";

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
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections');
        const data = await response.json();
        setCollections(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const SkeletonCard = () => (
    <div className="keen-slider__slide" style={{minWidth: '25%'}}>
      <div className="nft_coll">
        <div className="nft_wrap">
          <Skeleton width="100%" height="200px" />
        </div>
        <div className="nft_coll_pp">
          <Skeleton width="50px" height="50px" borderRadius="50%" />
        </div>
        <div className="nft_coll_info">
          <Skeleton width="80%" height="18px" />
          <div style={{height: '8px'}}></div>
          <Skeleton width="40%" height="14px" />
        </div>
      </div>
    </div>
  );

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
              {loading ? (
                new Array(4).fill(0).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : error ? (
                <div className="text-center" style={{padding: '40px'}}>
                  <p style={{color: 'red'}}>Error loading collections: {error}</p>
                </div>
              ) : (
                collections.map((collection, index) => (
                  <div className="keen-slider__slide" style={{minWidth: '25%'}} key={index}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to="/item-details">
                          <img src={collection.backgroundImage} className="lazy img-fluid" alt="" />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img className="lazy pp-coll" src={collection.profileImage} alt="" />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.name}</h4>
                        </Link>
                        <span>{collection.symbol}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
