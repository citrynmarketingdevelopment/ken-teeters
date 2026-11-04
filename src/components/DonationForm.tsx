'use client';
import { useState } from 'react';
import { ArrowUpRightIcon, LockKeyIcon } from '@phosphor-icons/react';

// Public button configuration from the foundation's existing QuickClick link.
// Amount is deliberately variable; the provider collects and authorizes payment.
export function DonationForm() {
  const [amount, setAmount] = useState('20');
  const [custom, setCustom] = useState('');
  return <form className="donation-form" action="https://quickclick.com/cart/cart.php" method="get">
    <h3>Your monthly gift</h3><p>Choose an amount in USD.</p>
    <fieldset className="donation-options"><legend className="sr-only">Monthly donation amount</legend>{['10','20','100','500','other'].map(value => <label key={value} className={amount === value ? 'selected' : ''}><input type="radio" name="amount-choice" value={value} checked={amount === value} onChange={() => setAmount(value)} /><span>{value === 'other' ? 'Other' : `$${value}`}</span></label>)}</fieldset>
    {amount === 'other' && <label className="foundation-field">Other amount (USD)<input type="number" min="1" max="100000" step="0.01" required value={custom} onChange={e => setCustom(e.target.value)} inputMode="decimal" /></label>}
    <input type="hidden" name="amount" value={amount === 'other' ? custom : amount} />
    <input type="hidden" name="key_id" value="14617877" />
    <input type="hidden" name="action" value="process_variable" />
    <input type="hidden" name="order_description" value="donation" />
    <input type="hidden" name="language" value="en" />
    <input type="hidden" name="customer_receipt" value="true" />
    <input type="hidden" name="hash" value="action|order_description|b23dbadde2093f8c02a1f759fe4f27ae" />
    <input type="hidden" name="allow_recurring" value="true" />
    <p className="donation-instructions">On the secure checkout page, select recurring giving and a <strong>monthly</strong> schedule. Review the amount and schedule before authorizing your credit or debit card.</p>
    <button className="foundation-button" type="submit">Continue to Checkout <ArrowUpRightIcon size={18} /></button>
    <p className="donation-security"><LockKeyIcon size={17} /> Card details are handled by QuickClick.</p>
    <p className="donation-help">For help changing or stopping a recurring gift, call <a href="tel:+16614961400">661-496-1400</a>.</p>
  </form>;
}
