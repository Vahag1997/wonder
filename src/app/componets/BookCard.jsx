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
      p={{ base: 3, md: 4 }}
      pb={{ base: 5, md: 6 }}
      maxW="xs"
      w="full"
      boxShadow="lg"
      position="relative"
      overflow="hidden"
      h="fit-content"
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

      <VStack spacing={{ base: 3, md: 4 }} align="center" position="relative" zIndex={1}>
        {/* Book Image */}
        <Image
          src={image}
          alt={title}
          borderRadius="lg"
          objectFit="cover"
          w="full"
          h={{ base: "200px", sm: "220px", md: "240px" }}
        />

        {/* Title */}
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          color="white"
          textAlign="center"
          mt={2}
          lineHeight="short"
          fontFamily="heading"
          px={{ base: 1, md: 2 }}
          noOfLines={2}
        >
          {title}
        </Text>

        {/* Subtitle */}
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="whiteAlpha.800"
          textAlign="center"
          px={{ base: 1, md: 2 }}
          noOfLines={2}
        >
          {subtitle}
        </Text>

        {/* CTA Button */}
        <Button
          mt={2}
          background="linear-gradient(to right, #c79df0ff, #9333ea)"
          color="white"
          borderRadius="full"
          px={{ base: 4, md: 6 }}
          py={{ base: 1.5, md: 2 }}
          fontWeight="medium"
          fontSize={{ base: "xs", md: "sm" }}
          onClick={onClick}
          _hover={{ bg: '#9333ea' }}
          w={{ base: "full", sm: "auto" }}
        >
          Смотреть сказку
        </Button>
      </VStack>
    </Box>
  );
}
