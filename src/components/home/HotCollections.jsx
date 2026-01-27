import React, { useState, useEffect} from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react"
import Skeleton from "../UI/Skeleton"
import AOS from "aos"


 
const HotCollections = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchData() {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
      )
      // artificial delay so skeleton is visible
      await new Promise(resolve => setTimeout(resolve, 1200))

      setCollections(data)
    } catch (err) {
      setError("Failed to load collections")
    } 
    finally {
      setLoading(false)
    }
    AOS.refresh();
  }

  // Slider configuration
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 4,
        spacing: 10,
      },
      rubberband: true, // smooth elastic scrolling effect
      //mobile view for the showing few slides
      breakpoints: {
        "(max-width: 991px)": {
          slides: { perView: 2, spacing: 15 },
        },
        "(max-width: 575px)": {
          slides: { perView: 1, spacing: 15 },
        },
      },
    },
    []
  )

  useEffect(() => {
    fetchData()
  }, [])

  if (loading){
    console.log("Skeleton loading ...")
    return (<section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>Hot Collections</h2>
            <div className="small-border bg-color-2"></div>
          </div>

          <section className="col-lg-12">
            <div className="keen-slider">
              {[...Array(4)].map((_, index) => (
                <div className="keen-slider__slide" key={index}>
                  <Skeleton />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>)
  } 
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center" data-aos="fade-up">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <section className="col-lg-12">
            {/* Slider container with relative positioning for controls */}
            <div className="slider-container">
              <div ref={sliderRef} className="keen-slider">
                {collections.map((item, index) => (
                  <div className="keen-slider__slide"
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to="/item-details">
                          <img
                            src={item.nftImage}
                            loading="lazy"
                            className="lazy img-fluid"
                            alt={item.title}
                            onLoad={(e)=>{
                              e.currentTarget.closest(".keen-slider__slide")?.classList.add("loaded")
                            }}
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-coll"
                            loading="lazy"
                            src={item.authorImage}
                            alt={item.title}
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{item.title}</h4>
                        </Link>
                        <span>{item.code}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* ARROWS (OUTSIDE the slider) */}
              <div className="slider-arrows">
                <button onClick={() => instanceRef.current?.prev()}>
                  ‹
                </button>
                <button onClick={() => instanceRef.current?.next()}>
                  ›
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default HotCollections

