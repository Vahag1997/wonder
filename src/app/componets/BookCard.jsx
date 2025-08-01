'use client';

import {
  Box,
  Image,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react';

export default function BookCard({ image, title, subtitle, onClick }) {
  return (
    <Box
      bg="linear-gradient(to bottom, #352d42ff, #2b1055)"
      borderRadius="2xl"
      p={4}
      pb={6}
      maxW="xs"
      w="full"
      boxShadow="lg"
      position="relative"
      overflow="hidden"
    >
      {/* Star dots background effect */}
      <Box
        position="absolute"
        inset="0"
        backgroundImage="radial-gradient(#fff 0.8px, transparent 0.8px)"
        backgroundSize="20px 20px"
        opacity={0.08}
        zIndex={0}
      />

      <VStack spacing={4} align="center" position="relative" zIndex={1}>
        {/* Book Image */}
        <Image
          src={image}
          alt={title}
          borderRadius="lg"
          objectFit="cover"
          w="full"
        />

        {/* Title */}
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="white"
          textAlign="center"
          mt={2}
          lineHeight="short"
          fontFamily="heading"
        >
          {title}
        </Text>

        {/* Subtitle */}
        <Text
          fontSize="sm"
          color="whiteAlpha.800"
          textAlign="center"
          px={2}
        >
          {subtitle}
        </Text>

        {/* CTA Button */}
        <Button
          mt={2}
          background="linear-gradient(to right, #c79df0ff, #9333ea)"
          color="white"
          borderRadius="full"
          px={6}
          py={2}
          fontWeight="medium"
          fontSize="sm"
          onClick={onClick}
          _hover={{ bg: '#9333ea' }}
        >
          Смотреть сказку
        </Button>
      </VStack>
    </Box>
  );
}
