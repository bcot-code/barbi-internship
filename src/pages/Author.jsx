import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";
import AuthorItems from "../components/author/AuthorItems";

const Author = () => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const {authorId} = useParams();

  // Check if already following when author data loads
  useEffect(() => {
    if (author) {
      // Check localStorage for follow status
      const followingList = JSON.parse(localStorage.getItem('following') || '[]');
      setIsFollowing(followingList.includes(authorId));
      setFollowerCount(author.followers || 573);
    }
  }, [author, authorId]);

  // Fetch author data
  useEffect(() =>{
    const fetchAuthor = async () => {
      try{
        const response = await fetch(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`);
       
        const data = await response.json();
        console.log("API Response:", data);
        console.log("Data type:", typeof data);
        console.log("Is Array:", Array.isArray(data));
        console.log("Author ID:", authorId);
        
        if (Array.isArray(data) && data.length > 0) {
          setAuthor(data[0]);
        } else {
          setAuthor(data);
        }
      }
      catch(err) {
        console.error("Failed to fetch author", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  },[authorId]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const followingList = JSON.parse(localStorage.getItem('following') || '[]');
      
      if (isFollowing) {
        // Unfollow
        const updatedList = followingList.filter(id => id !== authorId);
        localStorage.setItem('following', JSON.stringify(updatedList));
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        console.log(`Unfollowed author ${authorId}`);
      } else {
        // Follow
        if (!followingList.includes(authorId)) {
          followingList.push(authorId);
          localStorage.setItem('following', JSON.stringify(followingList));
        }
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        console.log(`Followed author ${authorId}`);
      }
    } catch (err) {
      console.error("Failed to toggle follow", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>

          {/* Profile Banner Skeleton */}
          <section
            id="profile_banner"
            aria-label="section"
            className="text-light"
            style={{ background: "#1a1a2e", minHeight: "200px" }}
          ></section>

          <section aria-label="section">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <Skeleton width="150px" height="150px" borderRadius="50%" />
                        <i className="fa fa-check" style={{ display: "none" }}></i>
                        <div className="profile_name">
                          <h4>
                            <Skeleton width="200px" height="24px" borderRadius="4px" />
                            <span className="profile_username">
                              <Skeleton width="100px" height="16px" borderRadius="4px" style={{ marginLeft: "10px" }} />
                            </span>
                            <span id="wallet" className="profile_wallet" style={{ display: "block", marginTop: "8px" }}>
                              <Skeleton width="300px" height="14px" borderRadius="4px" />
                            </span>
                            <button id="btn_copy" title="Copy Text" style={{ display: "none" }}>
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          <Skeleton width="80px" height="20px" borderRadius="4px" />
                        </div>
                        <Skeleton width="80px" height="40px" borderRadius="4px" style={{ marginTop: "10px" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <div className="tab-1">
                        <div className="row">
                          {[...Array(4)].map((_, i) => (
                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={i}>
                              <div className="nft__item">
                                <Skeleton width="40px" height="40px" borderRadius="50%" />
                                <div style={{ marginTop: "10px" }}>
                                  <Skeleton width="100%" height="220px" borderRadius="12px" />
                                </div>
                                <div style={{ marginTop: "12px" }}>
                                  <Skeleton width="70%" height="18px" borderRadius="4px" />
                                </div>
                                <div style={{ marginTop: "8px" }}>
                                  <Skeleton width="40%" height="16px" borderRadius="4px" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!author) return <p>No author data available</p>;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${author.authorImage}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={author.authorImage} alt={author.authorName} />

                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author.authorName}
                          <span className="profile_username">@{author.authorUsername}</span>
                          <span id="wallet" className="profile_wallet">
                            {author.address}
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">{followerCount} followers</div>
                      <button 
                        className={`btn-main ${isFollowing ? 'btn-secondary' : ''}`}
                        onClick={handleFollowToggle}
                        disabled={isProcessing}
                        style={{ minWidth: "100px" }}
                      >
                        {isProcessing ? (
                          <span><i className="fa fa-spinner fa-spin"></i>...</span>
                        ) : isFollowing ? (
                          "Unfollow"
                        ) : (
                          "Follow"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems authorId={authorId} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;

