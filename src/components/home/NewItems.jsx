import React, {useState, useEffect,} from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import Skeleton from "../UI/Skeleton";
import Countdown from "../UI/Countdown";
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react"

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewItems = async () => {
    try{
      const {data} = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      )
      setItems(data)
    }
    catch(err){
      setError("Failed to load new items")
    }
    finally {
      setTimeout(() => {
        setLoading(false)
      }, 1100);
    }
  }

  // Slider configuration
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 4,
        spacing: 15,
      },
      rubberband: true,
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
    fetchNewItems()
  },[])

  if (loading) {
    return (
      <section id="section-items" className="no-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2>New Items</h2>
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
      </section>
    )
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <section className="col-lg-12">
            <div className="slider-container">
              <div ref={sliderRef} className="keen-slider">
                {items.map((item) => (
                  <div
                    className="keen-slider__slide"
                    key={item.id}
                  >
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link
                          to={`/author/${item.authorId}`}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Creator: Monica Lucas"
                        >
                          <img 
                            className="img-fluid"
                            loading="lazy" 
                            src={item.nftImage} 
                            alt={item.title}
                            />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <Countdown expiryDate={item.expiryDate} />

                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button>Buy Now</button>
                            <div className="nft__item_share">
                              <h4>Share</h4>
                              <a href="" target="_blank" rel="noreferrer">
                                <i className="fa fa-facebook fa-lg"></i>
                              </a>
                              <a href="" target="_blank" rel="noreferrer">
                                <i className="fa fa-twitter fa-lg"></i>
                              </a>
                              <a href="">
                                <i className="fa fa-envelope fa-lg"></i>
                              </a>
                            </div>
                          </div>
                        </div>

                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            src={item.nftImage} 
                            className="lazy nft__item_preview"
                            alt={item.title}
                            loading="lazy"
                          />
                        </Link>
                      </div>
                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.title}</h4>
                        </Link>
                        <div className="nft__item_price">{item.price}ETH</div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
  );
};

export default NewItems;

