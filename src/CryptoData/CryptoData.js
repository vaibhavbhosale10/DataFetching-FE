import React, { useState, useEffect } from "react";
import "./Crypto.css";
import axios from "axios";
import { Pagination } from "@mui/material";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const CryptoData = () => {
  const [bitdata, setBitdata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const FetchBitCoin = async () => {
      try {
        const response = await axios.get("http://localhost:1010/api/bitcoin");
        setBitdata(
          response.data.coins.map((coin) => ({
            ...coin,
            showDetails: false,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };
    FetchBitCoin();
  }, []);

  const toggleDetails = (index) => {
    const updatedBitdata = [...bitdata];
    updatedBitdata[index].showDetails = !updatedBitdata[index].showDetails;
    setBitdata(updatedBitdata);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData = bitdata
    .filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(startIndex, endIndex);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h2 style={{ fontFamily: "Lato" }}>Bitcoin Information</h2>
      <input
        className="bitcoin-search"
        style={{}}
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search bitcoins by name..."
      />
      <div
        className="bitcoin-cards-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "space-between",
          marginTop: "50px",
        }}
      >
        {filteredData.map((coin, index) => {
          const globalIndex = startIndex + index;

          return (
            <Container key={globalIndex}>
              <Row key={globalIndex}>
                <Col sm={12} xl={12}>
                  <div
                    style={{ marginTop: "20px" }}
                    className={`crypto-card ${
                      coin.showDetails ? "show-details" : ""
                    }`}
                    key={globalIndex}
                  >
                    <div className="crypto-card-content">
                      <div className="crypto-info">
                        <h5 style={{ fontFamily: "Lato" }}> Name</h5>
                        <p className="bit-details">{coin.name}</p>
                      </div>
                      <div>
                        <h5 style={{ fontFamily: "Lato" }}>Price</h5>
                        <p className="bit-details"> {coin.price}</p>
                      </div>
                      <div>
                        <h5 style={{ fontFamily: "Lato" }}>Symbol</h5>
                        <p className="bit-details">{coin.symbol}</p>
                      </div>
                      <div>
                        <h5 style={{ fontFamily: "Lato" }}>Market Cap</h5>
                        <p className="bit-details"> {coin.marketCap}</p>
                      </div>
                    </div>
                    <button
                      className="view-details-btn"
                      onClick={() => {
                        toggleDetails(globalIndex);
                      }}
                    >
                      Show Details
                    </button>
                    {coin.showDetails && (
                      <div style={{ display: "flex" }}>
                        <div className="details">
                          <div>
                            <p className="bit-details">Rank: {coin.rank}</p>
                          </div>
                          <div>
                            <p className="bit-details">
                              Available Supply:{coin.availableSupply}
                            </p>
                          </div>
                          <div>
                            <p className="bit-details">
                              Total Supply: {coin.totalSupply}
                            </p>
                          </div>
                          <div>
                            <a href={coin.websiteUrl}>
                              Click here for more details
                            </a>
                          </div>
                        </div>
                        <div
                          className="bit-image"
                          style={{ marginTop: "50px" }}
                        >
                          <img src={coin.icon} alt="" className="coinimg" />
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Container>
          );
        })}
      </div>
      <Pagination
        className="pagination"
        style={{ marginTop: "20px" }}
        count={Math.ceil(
          bitdata.filter((coin) =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).length / itemsPerPage
        )}
        page={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default CryptoData;
