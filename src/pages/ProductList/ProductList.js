import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProductCard from "./components/ProductCard";

function ProductList() {
  const [ProductData, setProductData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:5000/api/products");
      setProductData(result.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <h3>商品列表</h3>
      <main className="d-flex">
        <Row>
          {ProductData.map((ProductData) => {
            return (
              <Col sm={6} md={4} lg={3} className="mb-4" key={ProductData._id}>
                <ProductCard ProductData={ProductData}></ProductCard>
              </Col>
            );
          })}
        </Row>
      </main>
    </>
  );
}

export default ProductList;
