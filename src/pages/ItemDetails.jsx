import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams} from "react-router-dom";
import EthereumIcon from "../images/ethereum.svg";
import Skeleton from "../components/UI/Skeleton";


const ItemDetails = () => {
  const {nftId} = useParams();
  console.log("NFT ID:", nftId);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const fetchItem = async () => {
      try{
        const {data} = await axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`);
        setItem(data);
      }
      catch(err) {
        console.error("Failed to fetch NFT");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2500);
      }
    };
    fetchItem();
    window.scrollTo(0, 0);
  },[nftId]);

  
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
            {loading ? (
              <div className="col-md-6">
                <Skeleton width="100%" height="400px" borderRadius="12px" />
              </div>
            ) : (
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={item.title}
                />
              </div>
            )}

            {loading ? (
              <div className="col-md-6">
                <div className="item_info">
                  <Skeleton width="60%" height="32px" borderRadius="8px" />
                  <div className="spacer-20"></div>
                  <div className="d-flex">
                    <Skeleton width="80px" height="24px" borderRadius="4px" />
                    <div className="mr20"></div>
                    <Skeleton width="80px" height="24px" borderRadius="4px" />
                  </div>
                  <div className="spacer-20"></div>
                  <Skeleton width="100%" height="80px" borderRadius="8px" />
                  <div className="spacer-30"></div>
                  <Skeleton width="120px" height="20px" borderRadius="4px" />
                  <div className="spacer-20"></div>
                  <div className="d-flex align-items-center">
                    <Skeleton width="48px" height="48px" borderRadius="50%" />
                    <div className="mr15"></div>
                    <Skeleton width="150px" height="20px" borderRadius="4px" />
                  </div>
                  <div className="spacer-30"></div>
                  <Skeleton width="120px" height="20px" borderRadius="4px" />
                  <div className="spacer-20"></div>
                  <div className="d-flex align-items-center">
                    <Skeleton width="48px" height="48px" borderRadius="50%" />
                    <div className="mr15"></div>
                    <Skeleton width="150px" height="20px" borderRadius="4px" />
                  </div>
                  <div className="spacer-30"></div>
                  <Skeleton width="120px" height="20px" borderRadius="4px" />
                  <div className="spacer-15"></div>
                  <div className="nft-item-price d-flex align-items-center">
                    <Skeleton width="24px" height="24px" borderRadius="4px" />
                    <div className="mr10"></div>
                    <Skeleton width="80px" height="24px" borderRadius="4px" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title}#{item.tag}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {item.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {item.likes}
                    </div>
                  </div>
                  <p>
                    {item.description}
                  </p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.ownerId}`}>
                            <img className="lazy" src={item.nftImage} alt={item.title} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.ownerId}`}>{item.ownerName}</Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.creatorId}`}>
                            <img className="lazy" src={item.creatorImage} alt={item.title} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.creatorId}`}>{item.creatorName}</Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthereumIcon} alt="Ethereum" />
                      <span>{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
