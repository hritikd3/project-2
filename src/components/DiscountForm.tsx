import React, { useState, useEffect } from 'react';

interface DiscountFormProps {
  discount?: {
    type: 'flat' | 'percentage';
    value: number;
  };
  onApplyDiscount: (discount: { type: 'flat' | 'percentage'; value: number }) => void;
}

const DiscountForm: React.FC<DiscountFormProps> = ({ discount, onApplyDiscount }) => {
  const [type, setType] = useState<'flat' | 'percentage'>(discount?.type || 'flat');
  const [value, setValue] = useState<string>(discount?.value?.toString() || '');

  useEffect(() => {
    if (discount) {
      setType(discount.type);
      setValue(discount.value.toString());
    } else {
      setType('flat');
      setValue('');
    }
  }, [discount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onApplyDiscount({ type, value: numValue });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as 'flat' | 'percentage')}
        className="border rounded px-2 py-1"
      >
        <option value="flat">Flat</option>
        <option value="percentage">Percentage</option>
      </select>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Discount value"
        className="border rounded px-2 py-1 w-24"
        min="0"
        max={type === 'percentage' ? "100" : undefined}
        step="0.01"
        required
      />
      <button
        type="submit"
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!value || isNaN(parseFloat(value))}
      >
        Apply
      </button>
    </form>
  );
};

export default DiscountForm;