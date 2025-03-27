import { useState } from "react";
import Button from "../UI/Button";

const PaymentForm = ({ expectedAmount, onSubmit, onCancel }) => {
  const [paidAmount, setPaidAmount] = useState(expectedAmount || 0);
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(Number(paidAmount));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="expectedAmount"
          className="block text-sm font-medium text-gray-700"
        >
          Expected Amount
        </label>
        <input
          type="number"
          id="expectedAmount"
          value={expectedAmount}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
        />
      </div>

      <div>
        <div className="flex items-center">
          <input
            id="defaultAmount"
            name="amountType"
            type="radio"
            checked={!isCustomAmount}
            onChange={() => {
              setIsCustomAmount(false);
              setPaidAmount(expectedAmount);
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label
            htmlFor="defaultAmount"
            className="ml-2 block text-sm text-gray-700"
          >
            Pay expected amount (${expectedAmount})
          </label>
        </div>

        <div className="flex items-center mt-2">
          <input
            id="customAmount"
            name="amountType"
            type="radio"
            checked={isCustomAmount}
            onChange={() => setIsCustomAmount(true)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label
            htmlFor="customAmount"
            className="ml-2 block text-sm text-gray-700"
          >
            Pay custom amount
          </label>
        </div>
      </div>

      {isCustomAmount && (
        <div>
          <label
            htmlFor="paidAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount Paid
          </label>
          <input
            type="number"
            id="paidAmount"
            name="paidAmount"
            min="0"
            step="0.01"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="success">
          Record Payment
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
