// app/orders/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { getOrderBySlug } from '../../constants';
import OrderDetails from './OrderDetails';
export default function OrderDetailsPage({ params }) {
  const order = getOrderBySlug(params.slug);
  if (!order) return notFound();

  return <OrderDetails order={order} />;
}
