import Modal from "react-modal";
import { IOrder } from "../../types/Types";

interface IOrderDetailsModal {
  isOpen: boolean;
  onClose: () => void;
  order: IOrder | null;
}

const OrderDetailsModal = ({ isOpen, onClose, order }: IOrderDetailsModal) => {
  if (!order) return null; // If no order is selected, don't render anything

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-white p-6 rounded-lg shadow-lg w-auto sm:max-w-2xl sm:w-full overflow-auto mx-4 md:mx-auto"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center z-999 break-words"
      data-testid="orderdetailmodal"
    >
      {/* Modal Header */}
      <h2 className="text-2xl font-semibold text-orange-600 font-primary">
        Order Details
      </h2>
      <div className="bg-orange-50 p-4 rounded-lg mt-2 font-secondary">
        <p className="text-amber-950">
          <strong className="text-amber-950">Order ID:</strong> {order.orderId}
        </p>
        <p className="text-amber-950">
          <strong className="text-amber-950">Date:</strong>{" "}
          {new Date(order.createdAt as string).toLocaleDateString()}
        </p>
        <p className="text-amber-950">
          <strong className="text-amber-950">Total:</strong> $
          {order.totalAmount.toFixed(2)}
        </p>
      </div>

      {/* Product List */}
      <h3 className="mt-4 text-lg font-semibold font-secondary text-amber-950">
        Items Purchased:
      </h3>
      <ul className="mt-2 space-y-4 max-h-50 sm:max-h-80 overflow-y-auto text-amber-950">
        {order.products.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-white shadow p-3 rounded-lg hover:shadow-md transition"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                ${item.price?.toFixed(2) ?? "0.00"} x {item.quantity}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition"
      >
        Close
      </button>
    </Modal>
  );
};

export default OrderDetailsModal;
