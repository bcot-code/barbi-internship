import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AuthorItems = ({authorId}) => {

  const [authors, setAuthors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const fetchAuthors = async () => {
      try{
        const {data} = await axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems`);
        setAuthors(data);
      }
      catch(err) {
        console.error("Failed to fetch NFT");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  },[authorId]);
  console.log("Author Id:", authorId)

  if (loading) return <p>Loading...</p>;
  if (!authors) return <p>Item not found</p>;

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {authors.map((author, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to="">
                    <img className="lazy" src={author.authorImage} alt={author.title} />
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
                  <Link to="/item-details">
                    <img
                      src={author.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>Pinky Ocean</h4>
                  </Link>
                  <div className="nft__item_price">2.52 ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>97</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
