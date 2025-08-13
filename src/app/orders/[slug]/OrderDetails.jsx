'use client';

import {
  Box, Container, Heading, Text, Button, Flex, Grid, Stack,
  HStack, VStack, Image, Link, Icon, Progress, Separator,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { LuFileDown, LuCheck, LuTruck } from 'react-icons/lu';

/* ---- reusable soft card ---- */
const SOFT_SHADOW = '0 10px 30px rgba(24,39,75,0.06), 0 2px 8px rgba(24,39,75,0.04)';
const SOFT_SHADOW_HOVER = '0 18px 40px rgba(24,39,75,0.10), 0 6px 16px rgba(24,39,75,0.06)';

function SoftCard({ children, p = 6, ...props }) {
  return (
    <Box
      bg="white"
      rounded="2xl"
      p={p}
      border="1px solid"
      borderColor="blackAlpha.100"
      boxShadow={SOFT_SHADOW}
      transition="transform .25s ease, box-shadow .25s ease"
      _hover={{ transform: 'translateY(-2px)', boxShadow: SOFT_SHADOW_HOVER }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ---- status bits ---- */
function StepDot({ state }) {
  const isPending = state === 'pending';
  const showCheck = state === 'done';
  const bg = isPending ? 'gray.200' : 'purple.600';

  return (
    <Box
      w="20px"
      h="20px"
      rounded="full"
      bg={bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow={isPending ? 'none' : '0 2px 6px rgba(124,58,237,0.35)'}
      border="2px solid"
      borderColor="white"
    >
      {showCheck && <Icon as={LuCheck} color="white" boxSize="12px" />}
    </Box>
  );
}


/* ---- page ---- */
export default function OrderDetails({ order }) {
  const { id, placedOn, steps, item, shippingInfo, totals } = {
    placedOn: order.date,
    ...order,
    shippingInfo: order.shippingInfo,
  };
  const grandTotal = totals.books + totals.shipping;

  return (
    <Box
      minH="100dvh"
      // softer app background
      bgGradient="linear(135deg, #faf5ff 0%, #f8fafc 55%, #ffffff 100%)"
      px={2}
    >
      <Container maxW="6xl" py={{ base: 8, md: 10 }}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={3}>
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.900">
            Order Details #{id}
          </Heading>
          <Button
            leftIcon={<LuFileDown />}
            bg="purple.500"
            color="white"
            fontWeight="semibold"
            _hover={{ bg: 'purple.600', boxShadow: '0 6px 16px rgba(124,58,237,0.24)' }}
            rounded="lg"
          >
            Invoice
          </Button>
        </Flex>

        <Text color="gray.600" mb={8}>
          Placed on: {placedOn}
        </Text>

        {/* Main two-column layout */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          {/* Item */}
          <Stack spacing={6}>
            <SoftCard>
              <Flex align="center" gap={6}>
                <Image
                  src={item.image}
                  alt={`Book cover for ${item.title}`}
                  w="96px"
                  h="128px"
                  objectFit="cover"
                  rounded="lg"
                  flexShrink={0}
                />

                <Box>
                  <Heading as="h3" fontSize="lg" fontWeight="semibold" color="gray.900">
                    {item.title}
                  </Heading>
                  <Text color="gray.600">{item.spec}</Text>

                  <HStack spacing={5} mt={4}>
                    <Link
                      as={NextLink}
                      href="#"
                      color="purple.700"
                      fontWeight="semibold"
                      textDecoration="underline"
                      textUnderlineOffset="3px"
                    >
                      Contact Support
                    </Link>
                    <Link
                      as={NextLink}
                      href="#"
                      color="purple.700"
                      fontWeight="semibold"
                      textDecoration="underline"
                      textUnderlineOffset="3px"
                    >
                      View Book
                    </Link>
                  </HStack>
                </Box>

                <Text ml="auto" fontSize="lg" fontWeight="bold" color="gray.900">
                  ${item.price.toFixed(2)}
                </Text>
              </Flex>
            </SoftCard>
          </Stack>

          {/* Shipping + Summary */}
          <Stack spacing={6}>
            {/* Shipping info */}
            <SoftCard>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading as="h2" fontSize="xl" fontWeight="semibold" color="gray.900">
                  Shipping Information
                </Heading>
                <Button
                  variant="outline"
                  colorScheme="purple"
                  leftIcon={<LuTruck />}
                  size="sm"
                  rounded="md"
                >
                  Edit
                </Button>
              </Flex>

              <VStack align="stretch" spacing={4}>
                <HStack align="flex-start">
                  <Icon as={LuTruck} color="gray.500" mt="2px" />
                  <Box>
                    <Text fontWeight="semibold" color="gray.900">
                      {shippingInfo.name}
                    </Text>
                    <Text color="gray.700">{shippingInfo.phone}</Text>
                    <Text color="gray.700">{shippingInfo.address1}</Text>
                    <Text color="gray.700">{shippingInfo.address2}</Text>
                  </Box>
                </HStack>

                <Flex align="flex-start" justify="space-between">
                  <HStack align="flex-start">
                    <Icon as={LuTruck} color="gray.500" mt="2px" />
                    <Box>
                      <Text fontWeight="semibold" color="gray.900">
                        {shippingInfo.method}
                      </Text>
                      <Text color="gray.600" fontSize="sm">
                        Estimated Delivery: {shippingInfo.eta}
                      </Text>
                    </Box>
                  </HStack>

                  <Text fontWeight="semibold" color="gray.900">
                    ${shippingInfo.cost.toFixed(2)}
                  </Text>
                </Flex>
              </VStack>
            </SoftCard>

            {/* Order summary */}
            <SoftCard>
              <Heading as="h2" fontSize="xl" fontWeight="semibold" mb={4} color="gray.900">
                Order Summary
              </Heading>

              <Stack spacing={3}>
                <Flex justify="space-between">
                  <Text color="gray.700">Books ({totals.booksCount})</Text>
                  <Text fontWeight="semibold" color="gray.900">
                    ${totals.books.toFixed(2)}
                  </Text>
                </Flex>

                <Flex justify="space-between">
                  <Text color="gray.700">Standard Shipping</Text>
                  <Text fontWeight="semibold" color="gray.900">
                    ${totals.shipping.toFixed(2)}
                  </Text>
                </Flex>

                <Separator my={3} />

                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color="purple.800">
                      Total
                    </Text>
                    <Text color="gray.600" fontSize="sm">
                      Method: {totals.method}
                    </Text>
                  </Box>

                  <Text fontSize="xl" fontWeight="bold" color="purple.800">
                    ${grandTotal.toFixed(2)}
                  </Text>
                </Flex>
              </Stack>
            </SoftCard>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}
