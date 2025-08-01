'use client';

import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react';

export default function BooksHeaderBanner() {
  return (
    <Box
      w="full"
      bg="#F0D9FF"
      borderRadius="xl"
      px={{ base: 4, md: 10 }}
      mb={10}
    >
      <Flex
        align="center"
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
        gap={8}
      >
        {/* Left Text Section */}
        <Box flex="1" textAlign={{ base: 'center', md: 'left' }}>
          <Heading
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="bold"
            color="purple.700"
            mb={3}
          >
            Hyper-personalised Books
          </Heading>
          <Text fontSize="lg" color="gray.700">
            A Story for Everyone, Tailored Just Right
          </Text>
        </Box>

        {/* Right Image Section */}
        <Box flex="1" maxW="400px">
          <Image
            src="/fairytale.png" 
            alt="Personalized Books"
            borderRadius="lg"
            objectFit="cover"
            w="full"
            h="200px"
          />
        </Box>
      </Flex>
    </Box>
  );
}
