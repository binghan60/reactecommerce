import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, ListGroup, Badge } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Rating from "./components/Rating";
import { Store } from "../../Store";
import axios from "axios";

function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const [ProductPageData, setProductPageData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        `http://localhost:5000/api/products/slug/${slug}`
      );
      setProductPageData(result.data);
    };
    fetchData();
  }, [slug]);
  if (ProductPageData.message === "找不到該產品") {
    navigate("/", { replace: true });
  }
  //state購物車狀態 每改變數量都發req給後端確認庫存
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === ProductPageData._id);
    //假如在車內 商品+1
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${ProductPageData._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("商品庫存不足");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...ProductPageData, quantity },
    });
  };
  //產品內頁
  console.log(ProductPageData.image);
  return (
    <>
      <Row>
        <Col sm={12} md={6} lg={6}>
          <img
            className="w-100"
            src={
              ProductPageData.image && ProductPageData.image.length > 20
                ? ProductPageData.image
                : `/imgs/${ProductPageData.image}`
            }
            alt={ProductPageData.name}
          />
        </Col>
        <Col sm={12} md={6} lg={6}>
          <ListGroup>
            <ListGroup.Item>
              {/* 網頁標題 */}
              <Helmet>
                <title className="text-center">{ProductPageData.name}</title>
              </Helmet>
            </ListGroup.Item>
            <ListGroup.Item>
              評價
              <Rating
                rating={ProductPageData.rating}
                numReviews={ProductPageData.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>
              商品描述：
              <p className="text-center">{ProductPageData.description}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              商品狀態：
              {ProductPageData.countInStock > 0 ? (
                <Badge bg="success">庫存充足</Badge>
              ) : (
                <Badge bg="danger">售完</Badge>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              價格：
              <p className="text-center">{ProductPageData.price}元</p>
            </ListGroup.Item>
            {ProductPageData.countInStock > 0 ? (
              <ListGroup.Item>
                <div className="d-grid">
                  <Button onClick={addToCartHandler} variant="success">
                    加入購物車
                  </Button>
                </div>
              </ListGroup.Item>
            ) : (
              <ListGroup.Item>
                <div className="d-grid">
                  <Button variant="danger" disabled>
                    商品補貨中
                  </Button>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
      <div className="text-center">
        <Link to={"/ProductList"}>
          <button className="btn btn-light my-5">回商品列表</button>
        </Link>
      </div>
    </>
  );
}

export default ProductPage;
