'use client';

import { useRouter } from 'next/navigation';
import { Box, Image, Text, Button, VStack, Flex } from '@chakra-ui/react';

export default function BookGridCard(props) {
  const { slug, image, cover, title, subtitle, description, onClick } = props;
  const router = useRouter();

  const imgSrc = image || cover;
  const subText = subtitle || description;

  const handleClick = onClick
    ? onClick
    : slug
    ? () => router.push(`/books/${slug}`)
    : undefined;

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
      minH="520px"
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
          src={imgSrc}
          alt={title}
          borderRadius="xl"
          objectFit="cover"
          w="full"
          h="280px"
        />

        {/* Text Section */}
        <Box minH="100px" p={2}>
          <Text
            fontSize="xl"
            fontWeight="extrabold"
            color="white"
            lineHeight="short"
            mb={1}
            noOfLines={2}
          >
            {title}
          </Text>
          <Text
            fontSize="sm"
            color="whiteAlpha.800"
            lineHeight="1.5"
            mt={4}
            noOfLines={3}
          >
            {subText}
          </Text>
        </Box>
      </VStack>

      {/* CTA Button */}
      <Box mt={4} zIndex={1}>
        <Button
          background="linear-gradient(to right, #c79df0ff, #9333ea)"
          color="white"
          borderRadius="full"
          px={6}
          py={3}
          fontWeight="medium"
          fontSize="sm"
          onClick={handleClick}
          w="full"
          _hover={{ bg: '#9333ea' }}
        >
          Смотреть сказку
        </Button>
      </Box>
    </Flex>
  );
}
