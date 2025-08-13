'use client';

import {
  Box, Heading, Text, Image, Flex, Grid, Link, HStack, Icon, Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { LuChevronRight } from 'react-icons/lu';

export default function OrderCard({ order }) {
  return (
    <Box bg="white" rounded="xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="blackAlpha.100">
      {/* Header */}
      <Flex align="center" justify="space-between" px={4} py={3} bg="purple.100">
        <Heading as="h2" fontSize="lg" color="gray.800" fontWeight="semibold">
          {order.qtyTitle}
        </Heading>

        <HStack>
          <Link
            as={NextLink}
            href={`/orders/${order.slug}`}
            color="purple.600"
            fontWeight="semibold"
            display="inline-flex"
            alignItems="center"
            gap="1"
          >
            View Details
            <Icon as={LuChevronRight} boxSize="18px" />
          </Link>
        </HStack>
      </Flex>

      {/* Body */}
      <Box p={6}>
        <Flex align="flex-start" gap={6}>
          {order.image && (
            <Image
              alt="Personalised Book Cover"
              src={order.image}
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
                  Date of order
                </Text>
                <Text fontWeight="semibold" color="gray.800">{order.date}</Text>
              </Stack>
              <Stack spacing={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase">
                  Total
                </Text>
                <Text fontWeight="semibold" color="gray.800">{order.total}</Text>
              </Stack>
              <Stack spacing={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase">
                  Address
                </Text>
                <Text fontWeight="semibold" color="gray.800">{order.address}</Text>
              </Stack>
              <Stack spacing={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase">
                  Shipping
                </Text>
                <Text fontWeight="semibold" color="gray.800">{order.shipping}</Text>
              </Stack>
            </Grid>

            <Text fontSize="sm" color="gray.600">{order.note}</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
