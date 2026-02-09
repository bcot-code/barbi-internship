import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react"
import AOS from "aos";
import "aos/dist/aos.css";


const AuthorItems = ({authorId}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    });
    const fetchAuthorItems = async () => {
      try{
        console.log("Fetching items for author ID:", authorId);
        const res = await fetch(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`);
        const data = await res.json();
        console.log("Fetched author items:", data);
        console.log("NFT Collection:", data.nftCollection);
        setItems(data.nftCollection || []);
        setTimeout(() => {
        AOS.refresh();
        }, 100);
      } catch(err){
        console.error("Error fetching author items:", err);
      } finally{
        setTimeout(() => {
          setLoading(false);
        }, 1100);
      }
    };
    if (authorId) {
      fetchAuthorItems();
    }
    
  }, [authorId]);


  if (loading) {
    return (
      <div
        className="col-lg-3 col-md-6"
        key="skeleton"
        data-aos="fade"
      >
        <Skeleton width="100%" height="250px" />
      </div>

    );
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="slider-container">
          <div ref={sliderRef} className="keen-slider">
            {items.map((item, index) => (
              <div
                className="keen-slider__slide"
                key={item.id || index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to="">
                      <img
                        className="img-fluid"
                        loading="lazy"
                        src={item.nftImage}
                        alt={item.title}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

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
                    <div className="nft__item_price">{item.price} ETH</div>
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
      </div>
    </div>
  );
};

export default AuthorItems;
