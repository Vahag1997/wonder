// app/orders/page.jsx
import { Container, Heading, Stack } from '@chakra-ui/react';
import { ORDERS } from '../constants';
import OrderCard from './OrderCard';

export default function OrdersPage() {
  return (
    <Container maxW="4xl" py={{ base: 10, md: 12 }}>
      <Heading as="h1" fontSize="4xl" fontWeight="bold" color="gray.800" mb={8}>
        Orders
      </Heading>

      <Stack spacing={6}>
        {ORDERS.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </Stack>
    </Container>
  );
}
