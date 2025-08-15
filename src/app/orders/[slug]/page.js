// app/orders/[slug]/page.jsx
import { notFound } from 'next/navigation';
import OrderDetails from './OrderDetails';

// Mocked order data (same as in orders/page.js)
const mockOrders = [
  {
    id: 1,
    order_number: "WW-2024-001",
    status: "completed",
    total: 29.99,
    created_at: "2024-01-15T10:30:00Z",
    items: [
      {
        id: 1,
        product: {
          title: "Adventure in Space",
          preview_url: "https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/books/space-adventure.jpg"
        },
        quantity: 1,
        price: 29.99
      }
    ],
    shipping_address: {
      name: "John Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001"
    }
  },
  {
    id: 2,
    order_number: "WW-2024-002",
    status: "in_progress",
    total: 34.99,
    created_at: "2024-01-20T14:15:00Z",
    items: [
      {
        id: 2,
        product: {
          title: "Dinosaur Explorer",
          preview_url: "https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/books/dinosaur-explorer.jpg"
        },
        quantity: 1,
        price: 34.99
      }
    ],
    shipping_address: {
      name: "Jane Smith",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90210"
    }
  },
  {
    id: 3,
    order_number: "WW-2024-003",
    status: "pending",
    total: 24.99,
    created_at: "2024-01-25T09:45:00Z",
    items: [
      {
        id: 3,
        product: {
          title: "Ocean Discovery",
          preview_url: "https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/books/ocean-discovery.jpg"
        },
        quantity: 1,
        price: 24.99
      }
    ],
    shipping_address: {
      name: "Mike Johnson",
      address: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zip: "60601"
    }
  }
];

export default function OrderDetailsPage({ params }) {
  // Find order by ID (params.slug contains the order ID)
  const order = mockOrders.find(order => order.id.toString() === params.slug);
  
  if (!order) return notFound();

  return <OrderDetails order={order} />;
}
