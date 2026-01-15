import React,{useState, useEffect} from "react";
import axios from "axios"
import { Link } from "react-router-dom";
import Countdown from "../UI/Countdown";
import Skeleton from "../UI/Skeleton";

const ExploreItems = () => {
const [selected, setSelectedFilter] = useState([]);
const [visibleCount, setVisibleCount] = useState(4);
const [isLoading, setIsLoading] = useState(true);
const [filter, setFilter] = useState("")

const fetchFilteredItems = async () => {
  try{
    const {data} = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/explore')
    console.log(data);
    setSelectedFilter(data)
  } catch(err){
    console.error("Failed to load filtered items")
  }
  finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 800);
    }
}


useEffect(() => {
    fetchFilteredItems()
  },[])

  if (isLoading) {
    return (
      <section id="section-items" className="no-bottom">
        <div className="container">
          <div className="row">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="col-lg-3 col-md-6 col-sm-6"
              >
                <div className="nft__item">
                  {/* author circle */}
                  <Skeleton width="40px" height="40px" borderRadius="50%" />

                  {/* image */}
                  <div style={{ marginTop: "10px" }}>
                    <Skeleton width="100%" height="220px" borderRadius="12px" />
                  </div>

                  {/* title */}
                  <div style={{ marginTop: "12px" }}>
                    <Skeleton width="70%" height="18px" borderRadius="4px" />
                  </div>

                  {/* price */}
                  <div style={{ marginTop: "8px" }}>
                    <Skeleton width="40%" height="16px" borderRadius="4px" />
                  </div>
              </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }


  const sortItems = [...selected].sort((a, b) => {
    if(filter === "price_low_to_high")
      return a.price - b.price;
    if(filter === "price_high_to_low")
      return b.price - a.price;
    if(filter === "likes_high_to_low")
      return b.likes - a.likes;
    return 0;
  });


  return (
    <div>
      <div>
        <select 
          id="filter-items" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      <div className="row">
        {sortItems.slice(0,visibleCount).map((select, i) => (
          <div
            key={i}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <div className="nft__item">
              <div className="author_list_pp">
                <Link
                  to={`/author/${select.authorId}`}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                >
                  <img className="lazy" src={select.authorImage} alt={select.title} />
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
                <div className="nft__item_wrap position-relative">
                  <div className="de_countdown">
                    <Countdown expiryDate={select.expiryDate} />
                  </div>
                  <Link to={`/item-details/${select.nftId}`}>
                    <img 
                      src={select.nftImage} 
                      className="lazy nft__item_preview" 
                      alt={select.title} 
                    />
                  </Link>
                </div>
              </div>
              <div className="nft__item_info">
                <Link to={`/item-details/${select.nftId}`}>
                  <h4>{select.title}</h4>
                </Link>
                <div className="nft__item_price">{select.price} ETH</div>
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>{select.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
        {visibleCount < selected.length && (
          <div className="col-md-12 text-center">
            <button
              id="loadmore"
              className="btn-main lead"
              onClick={() => setVisibleCount(visibleCount + 4)}
            >
              Load more
            </button>
          </div>
        )}
    </div>
  );
};

export default ExploreItems;
