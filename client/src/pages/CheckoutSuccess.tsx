import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import serverAPI from "../helper/axios";
import { IOrder } from "../types/Types";

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

        const response = await serverAPI.get(`/orders/success/${sessionId}`);
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-lg p-8 rounded-lg max-w-lg text-center">
        <h2 className="text-2xl font-semibold text-green-600">
          🎉 Payment Successful!
        </h2>
        <p className="mt-2 text-gray-700">Thank you for your purchase.</p>

        {order && (
          <div className="mt-6 text-left">
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>
            <p>
              <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
