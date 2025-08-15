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
    <Box px={{ base: 4, md: 16 }} py={12}  mx="auto">
      <VStack spacing={3} mb={10} textAlign="center">
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="wider"
          color="purple.600"
          textTransform="uppercase"
        >
          {subtitle}
        </Text>
        <Heading
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          lineHeight="shorter"
          color="purple.600"
        >
          {title}
        </Heading>
        <Separator
          w="100px"
          borderColor="purple.400"
          borderWidth="2px"
          opacity={1}
        />
      </VStack>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        gap={{ base: 6, md: 8 }}
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
