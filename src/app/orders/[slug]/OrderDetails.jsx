'use client';

import {
  Box, Container, Heading, Text, Button, Flex, Grid, Stack,
  HStack, VStack, Image, Link, Icon, Progress, Separator,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { LuFileDown, LuCheck, LuTruck } from 'react-icons/lu';
import { useLanguage } from '../../../contexts/LanguageContext';

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
  const { t } = useLanguage();
  
  // Transform the order data to match the expected structure
  const transformedOrder = {
    id: order.order_number,
    placedOn: new Date(order.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    item: {
      title: order.items?.[0]?.product?.title || 'Untitled Book',
      image: order.items?.[0]?.product?.preview_url || '/placeholder-book.jpg',
      spec: 'Personalized Book',
      price: order.total || 0
    },
    shippingInfo: {
      name: order.shipping_address?.name || 'N/A',
      phone: 'N/A',
      address1: order.shipping_address?.address || 'N/A',
      address2: `${order.shipping_address?.city || ''}, ${order.shipping_address?.state || ''} ${order.shipping_address?.zip || ''}`,
      method: 'Standard Shipping',
      eta: '3-5 business days',
      cost: 5.99
    },
    totals: {
      books: order.total || 0,
      booksCount: order.items?.length || 0,
      shipping: 5.99,
      method: 'Credit Card'
    }
  };

  const { id, placedOn, item, shippingInfo, totals } = transformedOrder;
  const grandTotal = totals.books + totals.shipping;

  return (
    <Box
      minH="100dvh"
      bgGradient="linear(135deg, #faf5ff 0%, #f8fafc 55%, #ffffff 100%)"
      px={{ base: 2, md: 4 }}
    >
      <Container maxW="6xl" py={{ base: 6, md: 10 }}>
        {/* Header */}
        <VStack align="start" spacing={{ base: 4, md: 6 }} mb={{ base: 6, md: 8 }}>
          <Flex 
            justify="space-between" 
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            w="full"
            gap={{ base: 4, md: 0 }}
          >
            <VStack align="start" spacing={2}>
              <Heading 
                as="h1" 
                fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} 
                fontWeight="bold" 
                color="gray.900"
                lineHeight="shorter"
              >
                {t("orders.orderDetails")} #{id}
              </Heading>
              <Text 
                color="gray.600" 
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="medium"
              >
                {t("orders.placedOn")} {placedOn}
              </Text>
            </VStack>
            
            <Button
              leftIcon={<Icon as={LuFileDown} boxSize={{ base: 4, md: 5 }} />}
              bg="purple.500"
              color="white"
              fontWeight="semibold"
              size={{ base: "md", md: "lg" }}
              px={{ base: 4, md: 6 }}
              py={{ base: 2, md: 3 }}
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ bg: 'purple.600', boxShadow: '0 6px 16px rgba(124,58,237,0.24)' }}
              rounded="lg"
            >
              {t("orders.invoice")}
            </Button>
          </Flex>
        </VStack>

        {/* Main two-column layout */}
        <Grid 
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }} 
          gap={{ base: 6, md: 8 }}
        >
          {/* Item */}
          <Stack spacing={{ base: 4, md: 6 }}>
            <SoftCard p={{ base: 4, md: 6 }}>
              <Flex 
                align="center" 
                gap={{ base: 4, md: 6 }}
                direction={{ base: "column", sm: "row" }}
                textAlign={{ base: "center", sm: "left" }}
              >
                <Image
                  src={item.image}
                  alt={`Book cover for ${item.title}`}
                  w={{ base: "80px", sm: "96px" }}
                  h={{ base: "106px", sm: "128px" }}
                  objectFit="cover"
                  rounded="lg"
                  flexShrink={0}
                  shadow="md"
                />

                <VStack 
                  align={{ base: "center", sm: "start" }} 
                  spacing={3}
                  flex={1}
                >
                  <VStack align={{ base: "center", sm: "start" }} spacing={1}>
                    <Heading 
                      as="h3" 
                      fontSize={{ base: "md", md: "lg" }} 
                      fontWeight="semibold" 
                      color="gray.900"
                      textAlign={{ base: "center", sm: "left" }}
                    >
                      {item.title}
                    </Heading>
                    <Text 
                      color="gray.600" 
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {item.spec}
                    </Text>
                  </VStack>

                  <HStack 
                    spacing={{ base: 3, md: 5 }} 
                    flexWrap="wrap"
                    justify={{ base: "center", sm: "start" }}
                  >
                    <Link
                      as={NextLink}
                      href="#"
                      color="purple.700"
                      fontWeight="semibold"
                      fontSize={{ base: "sm", md: "md" }}
                      textDecoration="underline"
                      textUnderlineOffset="3px"
                      _hover={{ color: 'purple.800' }}
                    >
                      {t("orders.contactSupport")}
                    </Link>
                    <Link
                      as={NextLink}
                      href="#"
                      color="purple.700"
                      fontWeight="semibold"
                      fontSize={{ base: "sm", md: "md" }}
                      textDecoration="underline"
                      textUnderlineOffset="3px"
                      _hover={{ color: 'purple.800' }}
                    >
                      {t("orders.viewBook")}
                    </Link>
                  </HStack>
                </VStack>

                <Text 
                  fontSize={{ base: "lg", md: "xl" }} 
                  fontWeight="bold" 
                  color="gray.900"
                  textAlign={{ base: "center", sm: "right" }}
                >
                  ${item.price.toFixed(2)}
                </Text>
              </Flex>
            </SoftCard>
          </Stack>

          {/* Shipping + Summary */}
          <Stack spacing={{ base: 4, md: 6 }}>
            {/* Shipping info */}
            <SoftCard p={{ base: 4, md: 6 }}>
              <Flex 
                justify="space-between" 
                align="center" 
                mb={{ base: 3, md: 4 }}
                direction={{ base: "column", sm: "row" }}
                gap={{ base: 3, sm: 0 }}
              >
                <Heading 
                  as="h2" 
                  fontSize={{ base: "lg", md: "xl" }} 
                  fontWeight="semibold" 
                  color="gray.900"
                  textAlign={{ base: "center", sm: "left" }}
                >
                  {t("orders.shippingInfo")}
                </Heading>
                <Button
                  variant="outline"
                  colorScheme="purple"
                  leftIcon={<Icon as={LuTruck} boxSize={{ base: 4, md: 5 }} />}
                  size={{ base: "sm", md: "md" }}
                  rounded="md"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {t("orders.edit")}
                </Button>
              </Flex>

              <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                <HStack align="flex-start" spacing={3}>
                  <Icon 
                    as={LuTruck} 
                    color="gray.500" 
                    mt="2px" 
                    boxSize={{ base: 4, md: 5 }}
                  />
                  <VStack align="start" spacing={1}>
                    <Text 
                      fontWeight="semibold" 
                      color="gray.900"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {shippingInfo.name}
                    </Text>
                    <Text 
                      color="gray.700"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {shippingInfo.phone}
                    </Text>
                    <Text 
                      color="gray.700"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {shippingInfo.address1}
                    </Text>
                    <Text 
                      color="gray.700"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {shippingInfo.address2}
                    </Text>
                  </VStack>
                </HStack>

                <Flex 
                  align="flex-start" 
                  justify="space-between"
                  direction={{ base: "column", sm: "row" }}
                  gap={{ base: 2, sm: 0 }}
                >
                  <HStack align="flex-start" spacing={3}>
                    <Icon 
                      as={LuTruck} 
                      color="gray.500" 
                      mt="2px"
                      boxSize={{ base: 4, md: 5 }}
                    />
                    <VStack align="start" spacing={1}>
                      <Text 
                        fontWeight="semibold" 
                        color="gray.900"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {shippingInfo.method}
                      </Text>
                      <Text 
                        color="gray.600" 
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {t("orders.estimatedDelivery")}: {shippingInfo.eta}
                      </Text>
                    </VStack>
                  </HStack>

                  <Text 
                    fontWeight="semibold" 
                    color="gray.900"
                    fontSize={{ base: "md", md: "lg" }}
                    textAlign={{ base: "left", sm: "right" }}
                  >
                    ${shippingInfo.cost.toFixed(2)}
                  </Text>
                </Flex>
              </VStack>
            </SoftCard>

            {/* Order summary */}
            <SoftCard p={{ base: 4, md: 6 }}>
              <Heading 
                as="h2" 
                fontSize={{ base: "lg", md: "xl" }} 
                fontWeight="semibold" 
                mb={{ base: 3, md: 4 }} 
                color="gray.900"
                textAlign={{ base: "center", md: "left" }}
              >
                {t("orders.orderSummary")}
              </Heading>

              <Stack spacing={{ base: 2, md: 3 }}>
                <Flex justify="space-between" align="center">
                  <Text 
                    color="gray.700"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {t("orders.books")} ({totals.booksCount})
                  </Text>
                  <Text 
                    fontWeight="semibold" 
                    color="gray.900"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    ${totals.books.toFixed(2)}
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text 
                    color="gray.700"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {t("orders.standardShipping")}
                  </Text>
                  <Text 
                    fontWeight="semibold" 
                    color="gray.900"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    ${totals.shipping.toFixed(2)}
                  </Text>
                </Flex>

                <Separator my={{ base: 2, md: 3 }} />

                <Flex 
                  justify="space-between" 
                  align="center"
                  direction={{ base: "column", sm: "row" }}
                  gap={{ base: 2, sm: 0 }}
                >
                  <VStack align={{ base: "center", sm: "start" }} spacing={1}>
                    <Text 
                      fontSize={{ base: "md", md: "lg" }} 
                      fontWeight="bold" 
                      color="purple.800"
                      textAlign={{ base: "center", sm: "left" }}
                    >
                      {t("orders.total")}
                    </Text>
                    <Text 
                      color="gray.600" 
                      fontSize={{ base: "xs", md: "sm" }}
                      textAlign={{ base: "center", sm: "left" }}
                    >
                      {t("orders.method")}: {totals.method}
                    </Text>
                  </VStack>

                  <Text 
                    fontSize={{ base: "lg", md: "xl" }} 
                    fontWeight="bold" 
                    color="purple.800"
                    textAlign={{ base: "center", sm: "right" }}
                  >
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
