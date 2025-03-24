import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import serverAPI from "../helper/axios";
import { IOrder } from "../types/Types";
import PageHeader from "../components/PageHeader";

const CheckoutSuccess = () => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!sessionId) {
          setError("Invalid session.");
          setLoading(false);
          return;
        }

        const response = await serverAPI.get(`/order/success/${sessionId}`);
        setOrder(response.data);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading)
    return (
      <div className="text-center mt-10 text-orange-500 font-semibold">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <>
      <PageHeader />
      <div className="min-h-screen">
        <div className="relative z-50 max-md:-mt-42 -mt-45 flex justify-center p-7">
          <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl text-center break-words text-amber-950 ">
            <h2 className="text-3xl font-bold text-orange-600 font-primary">
              🎉 Success!
            </h2>
            <p className="mt-2 text-gray-700 font-secondary">
              Thank you for your purchase.
            </p>

            {order && (
              <div className="mt-6 text-left font-secondary">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="">
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p className="">
                    <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                  </p>
                </div>

                {/* Product List */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Items Purchased:</h3>
                  <ul className="mt-2 space-y-4 max-h-110 overflow-y-auto">
                    {order.products.map((product, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-white shadow p-3 rounded-lg hover:shadow-md transition"
                      >
                        <div>
                          <p className=" font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            ${product.price.toFixed(2)} x {product.quantity}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate("/shop")}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-full shadow-md transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutSuccess;
