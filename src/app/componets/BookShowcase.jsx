"use client";

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Separator,
} from "@chakra-ui/react";
import BookCard from "./BookCard";
import { books } from "../constants";
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookShowcase({
  title = "More Stories, More Magic",
  subtitle = "NEW BOOKS",
  data = books,
}) {
  const { t } = useLanguage();

  return (
    <Box 
      px={{ base: 4, md: 8, lg: 16 }} 
      py={{ base: 8, md: 12 }} 
      mx="auto"
      w="full"
      maxW="8xl"
    >
      <VStack spacing={4} mb={{ base: 8, md: 12 }} textAlign="center">
        <Text
          fontSize={{ base: "sm", md: "md" }}
          fontWeight="medium"
          letterSpacing="wider"
          color="purple.600"
          textTransform="uppercase"
        >
          {subtitle}
        </Text>
        <Heading
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="bold"
          lineHeight="shorter"
          color="purple.600"
          px={{ base: 2, md: 0 }}
        >
          {title}
        </Heading>
        <Separator
          w="120px"
          borderColor="purple.400"
          borderWidth="3px"
          opacity={1}
        />
      </VStack>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        gap={{ base: 4, sm: 6, md: 8 }}
        spacing={{ base: 4, sm: 6, md: 8 }}
        w="full"
        justifyItems={{ base: "center", sm: "stretch" }}
        maxW={{ base: "320px", sm: "none" }}
        mx={{ base: "auto", sm: "0" }}
      >
        {data.map((book, idx) => (
          <BookCard
            key={idx}
            {...book}
            onClick={() => console.log(book.title)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
