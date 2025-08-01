"use client";

import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  Image,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ageRanges } from "../constants";

export default function AgeBrowseSection() {
  const router = useRouter();

  const handleClick = (age) => {
    router.push(`/books?age=${encodeURIComponent(age)}`);
  };

  return (
    <Box px={{ base: 4, md: 16 }} py={12} textAlign="center">
      <Heading
        mb={10}
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="bold"
        lineHeight="shorter"
        color="purple.600"
      >
        Browse Stories by Age
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={10}>
        {ageRanges.map(({ label, image, colorScheme }) => (
          <Box
            key={label}
            position="relative"
            borderRadius="md"
            overflow="hidden"
            shadow="md"
            _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
          >
            <Image
              src={image}
              alt={`Age ${label}`}
              objectFit="cover"
              w="full"
              h="300px"
            />

            <VStack
              position="absolute"
              top={0}
              left={0}
              w="full"
              h="full"
              justify="space-between"
              bgGradient="linear(to-b, blackAlpha.400, blackAlpha.800)"
              color="white"
              py={14}
            >
              <Text fontSize="xl" fontWeight="semibold">
                Age
              </Text>
              <Text fontSize="3xl" fontWeight="bold">
                {label}
              </Text>
              <Button
                background="linear-gradient(to right, #c79df0ff, #9333ea)"
                variant="solid"
                onClick={() => handleClick(label)}
              >
                <Text color="white">Discover</Text>
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
