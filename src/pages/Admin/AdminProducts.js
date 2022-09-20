import axios from "axios";
import { useReducer, useEffect, useContext } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import { Store } from "../../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

function AdminProducts() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, products, pages, loadingCreate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const { search } = useLocation();
  //search是useLocation下的變數代表整串query string 從?開始的值
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/admin?page=${page}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "取得商品列表失敗" });
      }
    };
    fetchData();
  }, [page, userInfo]);

  const createHandler = async () => {
    if (window.confirm("確定要新增商品?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await axios.post(
          "http://localhost:5000/api/products",
          {}, //沒有傳資料給後端
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        toast.success("成功新增");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/adminproducts/${data.product._id}`);
      } catch (err) {
        toast.error("新增失敗");
        dispatch({ type: "CREATE_FAIL" });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title className="text-center">商品管理</title>
      </Helmet>
      <Row>
        <Col>
          <h3>商品管理</h3>
        </Col>
        <Col className="col text-end">
          <Button type="button" onClick={createHandler}>
            <i className="fa-solid fa-plus"></i> 新商品
          </Button>
        </Col>
      </Row>
      {loadingCreate && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        "發生錯誤"
      ) : (
        <>
          <table className="table table-dark">
            <thead>
              <tr>
                <th>商品ID</th>
                <th>名稱</th>
                <th>價格</th>
                <th>種類</th>
                <th>品牌</th>
                <th>功能</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/adminproducts/${product._id}`)}
                    >編輯</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center">
            {[...Array(pages).keys()].map((x) => (
              <LinkContainer
                className="mx-2"
                key={x + 1}
                to={`/admin/adminproducts?page=${x + 1}`} //x從0開始 因此x+1
              >
                <Button
                  className={Number(page) === x + 1 ? "text-bold" : ""}
                  variant="light"
                >
                  {x + 1}
                </Button>
              </LinkContainer>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default AdminProducts;
{
  /* <Link
                className={x + 1 === Number(page) ? "btn text-bold" : "btn"} 
                key={x + 1}
                to={`/admin/adminproducts?page=${x + 1}`}
                
              >
                {x + 1}
              </Link> */
}