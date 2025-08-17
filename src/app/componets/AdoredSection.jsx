"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useLanguage } from '../../contexts/LanguageContext';

export default function AdoredSection() {
  const { t } = useLanguage();

  return (
    <Box
      bg="linear-gradient(to bottom, #644a99ff, #2b1055)"
      overflow="hidden"
      py={{ base: 16, md: 22 }} // increased vertical padding
      px={{ base: 6, md: 16 }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        maxW="7xl"
        mx="auto"
        minH={{ base: "auto", md: "400px" }} // force taller section
      >
        {/* Text Section */}
        <VStack
          align="start"
          spacing={6}
          flex="1"
          maxW="lg"
          mb={{ base: 12, md: 0 }}
        >
          <Heading
            fontSize={{ base: "4xl", md: "5xl" }}
            fontWeight="semibold"
            color="white"
            lineHeight="short"
          >
            {t("banners.adoredByMillions")}
          </Heading>

          <Text fontSize={{ base: "lg", md: "xl" }} color="whiteAlpha.900">
            {t("banners.adoredDescription")}
          </Text>

          <Button
            colorScheme="whiteAlpha"
            variant="solid"
            size="lg"
            px={8}
            fontWeight="semibold"
          >
            {t("books.explore")}
          </Button>
        </VStack>

        {/* Logo Image */}
        <Box flex="1" maxW="lg" display="flex" justifyContent="center">
          <Image
            src="/dog.svg"
            alt="Wonder Wraps Logo"
            w={{ base: "60%", md: "80%" }} // increased image size
            h="auto"
            objectFit="contain"
          />
        </Box>
      </Flex>
    </Box>
  );
}
