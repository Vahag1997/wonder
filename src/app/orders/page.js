'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Heading, 
  Stack, 
  Center, 
  Spinner, 
  Text, 
  VStack,
  Button,
  Icon
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { getMyOrders } from '../../lib/api';
import OrderCard from './OrderCard';
import ProtectedRoute from '../../components/ProtectedRoute';
import BottomBanner from '../componets/BottomBanner';

// Mocked order data
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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Commented out real API call for now
      // const data = await getMyOrders();
      // setOrders(data || []);
      
      // Using mocked data instead
      setOrders(mockOrders);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Container maxW="4xl" py={{ base: 10, md: 12 }}>
          <Center py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="purple.600" thickness="4px" />
              <Text fontSize="lg" color="gray.600">Loading your orders...</Text>
            </VStack>
          </Center>
        </Container>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Container maxW="4xl" py={{ base: 10, md: 12 }}>
          <Center py={20}>
            <VStack spacing={4}>
              <Icon as={FaExclamationTriangle} boxSize={12} color="red.500" />
              <Text fontSize="lg" color="red.600">Error loading orders: {error}</Text>
              <Button onClick={fetchOrders} colorScheme="purple">
                Try Again
              </Button>
            </VStack>
          </Center>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <>
      <ProtectedRoute>
        <Container maxW="4xl" py={{ base: 10, md: 12 }}>
          <Heading as="h1" fontSize="4xl" fontWeight="bold" color="gray.800" mb={8}>
            My Orders
          </Heading>

          {orders.length === 0 ? (
            <Center py={20}>
              <VStack spacing={6}>
                <Text fontSize="xl" fontWeight="medium" color="gray.600">
                  No orders yet
                </Text>
                <Text fontSize="md" color="gray.500" textAlign="center">
                  Your order history will appear here once you make your first purchase
                </Text>
              </VStack>
            </Center>
          ) : (
            <Stack spacing={6}>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </Stack>
          )}
        </Container>
      </ProtectedRoute>
      
      {/* Bottom Banner - Right above footer */}
      <BottomBanner />
    </>
  );
}
