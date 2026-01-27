import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "../UI/Skeleton"
// import AuthorImage from "../../images/author_thumbnail.jpg";
import AOS from "aos";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () =>{
    try {
      const {data} = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers")
      console.log("API Data:", data)
      console.log("First item ID:", data[0]?.id)
      setSellers(data)
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    } catch (error) {
      console.error("Error fetching sellers:", error)
    } finally{
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center" data-aos="fade-up">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
            {loading
              ?
              [...Array(12)].map((_, i) =>(
                <li key={i} className="d-flex align-items-center mb-4" data-aos="fade-up" data-aos-delay={i * 60}>
                  {/* avatar */}
                  <Skeleton 
                    width="50px"
                    height="50px"
                    borderRadius="50%"
                  />
                  {/* text */}
                  <div style={{ marginLeft: "15px", width: "100%" }}>
                  <Skeleton
                    width="120px"
                    height="12px"
                    borderRadius="6px"
                  />
                  <div style={{ marginTop: "8px" }}>
                      <Skeleton
                        width="80px"
                        height="12px"
                        borderRadius="6px"
                      />
                    </div>
                  </div>
                </li>
              )) :
              sellers.map((seller, index) => (
                <li key={seller.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 80}>
                  <div className="author_list_pp">
                    <Link to={`/author/${seller.authorId}`}>
                      <img
                        className="lazy pp-author"
                        src={seller.authorImage}
                        alt={seller.authorName}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="author_list_info">
                    <Link to={`/author/${seller.authorId}`}>
                      {seller.authorName}
                    </Link>
                    <span>{seller.price} ETH</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
