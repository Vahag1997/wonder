'use client';

import {
  Box, Heading, Text, Image, Flex, Grid, Link, HStack, Icon, Stack, Badge,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { LuChevronRight } from 'react-icons/lu';
import { useLanguage } from '../../contexts/LanguageContext';

export default function OrderCard({ order }) {
  const { t } = useLanguage();

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return t("orders.delivered");
      case 'in_progress': return t("orders.processing");
      case 'pending': return t("orders.pending");
      case 'failed': return t("orders.failed");
      default: return status?.replace('_', ' ') || 'Unknown';
    }
  };

  return (
    <Box bg="white" rounded="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="blackAlpha.100">
      {/* Header */}
      <Flex align="center" justify="space-between" px={4} py={3} bg="purple.100">
        <HStack spacing={3}>
          <Heading as="h2" fontSize="lg" color="gray.800" fontWeight="semibold">
            {order.order_number}
          </Heading>
          <Badge
            colorScheme={getStatusColor(order.status)}
            borderRadius="full"
            px={3}
            py={1}
            fontSize="xs"
            fontWeight="bold"
          >
            {getStatusText(order.status)}
          </Badge>
        </HStack>

        <HStack>
          <Link
            as={NextLink}
            href={`/orders/${order.id}`}
            color="purple.600"
            fontWeight="semibold"
            display="inline-flex"
            alignItems="center"
            gap="1"
            _hover={{ color: 'purple.700' }}
          >
            {t("orders.viewDetails")}
            <Icon as={LuChevronRight} boxSize="18px" />
          </Link>
        </HStack>
      </Flex>

      {/* Body */}
      <Box p={6}>
        <Flex align="flex-start" gap={6}>
          {order.items && order.items[0]?.product?.preview_url && (
            <Image
              alt="Personalised Book Cover"
              src={order.items[0].product.preview_url}
              w="96px"
              h="96px"
              objectFit="cover"
              rounded="md"
              flexShrink={0}
            />
          )}

          <Box flex="1">
            <Grid templateColumns={{ base: '1fr 1fr', sm: 'repeat(4, 1fr)' }} gap={6} mb={4}>
              <Stack spacing={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase">
                  {t("orders.dateOfOrder")}
                </Text>
                <Text fontWeight="semibold" color="gray.800">
                  {formatDate(order.created_at)}
                </Text>
              </Stack>
              <Stack spacing={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase">
                  {t("orders.total")}
                </Text>
                <Text fontWeight="semibold" color="gray.800">
                  ${order.total?.toFixed(2)}
                </Text>
              </Stack>
              <Stack spacing={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase">
                  {t("orders.address")}
                </Text>
                <Text fontWeight="semibold" color="gray.800" noOfLines={1}>
                  {order.shipping_address?.city}, {order.shipping_address?.state}
                </Text>
              </Stack>
              <Stack spacing={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase">
                  {t("orders.status")}
                </Text>
                <Text fontWeight="semibold" color="gray.800">
                  {getStatusText(order.status)}
                </Text>
              </Stack>
            </Grid>

            {order.items && order.items[0]?.product?.title && (
              <Text fontSize="sm" color="gray.600">
                {order.items[0].product.title}
              </Text>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
