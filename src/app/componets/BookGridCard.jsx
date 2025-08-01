'use client';

import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  Flex,
} from '@chakra-ui/react';

export default function BookGridCard({ image, title, subtitle, onClick }) {
  return (
    <Flex
      direction="column"
      justify="space-between"
      bg="linear-gradient(to bottom, #352d42ff, #2b1055)"
      borderRadius="2xl"
      px={5}
      py={6}
      w="full"
      boxShadow="lg"
      position="relative"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
      minH="520px" // 👈 consistent card height
    >
      {/* Star background */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="radial-gradient(#fff 0.8px, transparent 0.8px)"
        backgroundSize="20px 20px"
        opacity={0.06}
        zIndex={0}
      />

      <VStack spacing={4} align="start" position="relative" zIndex={1} flex="1">
        {/* Book Image */}
        <Image
          src={image}
          alt={title}
          borderRadius="xl"
          objectFit="cover"
          w="full"
          h="280px"
        />

        {/* Text Section with fixed space */}
        <Box minH="100px"p={2}>
          <Text
            fontSize="xl"
            fontWeight="extrabold"
            color="white"
            lineHeight="short"
            mb={1}
          >
            {title}
          </Text>
          <Text
            fontSize="sm"
            color="whiteAlpha.800"
            lineHeight="1.5"
            mt={4}
          >
            {subtitle}
          </Text>
        </Box>
      </VStack>

      {/* CTA Button pinned to bottom */}
      <Box mt={4} zIndex={1}>
        <Button
          background="linear-gradient(to right, #c79df0ff, #9333ea)"
          color="white"
          borderRadius="full"
          px={6}
          py={3}
          fontWeight="medium"
          fontSize="sm"
          onClick={onClick}
          w="full"
          _hover={{ bg: '#9333ea' }}
        >
          Смотреть сказку
        </Button>
      </Box>
    </Flex>
  );
}
