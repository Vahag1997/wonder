'use client';

import { useState } from 'react';
import { Box, Heading, SimpleGrid, VStack, HStack, Button, Icon, Text, Flex } from '@chakra-ui/react';
import { FaVenusMars, FaChild } from 'react-icons/fa';
import { getAllBooks } from './constants';
import BookGridCard from './BookGridCard';
import { useLanguage } from '../../contexts/LanguageContext';

import BooksHeaderBanner from './BooksHeaderBanner';
import AgeBrowseSection from '../componets/AgeBrowseSection';
import BottomBanner from '../componets/BottomBanner';

export default function BooksPage() {
  const { t } = useLanguage();
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);

  const allBooks = getAllBooks();

  const filteredBooks = allBooks.filter((book) => {
    const genderMatch = !gender || book.gender === gender;
    const ageMatch = !age || book.ageRange.includes(age);
    return genderMatch && ageMatch;
  });

  return (
    <>
      <Box px={{ base: 4, md: 10 }} py={10}>
        <BooksHeaderBanner />

        <VStack align="start" spacing={6} mb={8}>
          <Heading fontSize="3xl" color="black">
            {t("books.findPerfectBook")}
          </Heading>

          <Flex
            w="full"
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gap={6}
            wrap="wrap"
          >
            <VStack align="start" spacing={3}>
              <HStack spacing={2}>
                <Icon as={FaVenusMars} color="purple.500" />
                <Text fontWeight="medium" color="black">
                  {t("books.gender")}
                </Text>
              </HStack>
              <HStack spacing={2}>
                {[t("books.boy"), t("books.girl")].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setGender(gender === option ? null : option)}
                    borderRadius="full"
                    variant="solid"
                    size="sm"
                    px={5}
                    bg={gender === option ? 'linear-gradient(to-r, #a855f7, #9333ea)' : 'gray.100'}
                    color={gender === option ? 'white' : 'gray.800'}
                    _hover={{
                      bg: gender === option ? 'linear-gradient(to-r, #9333ea, #7e22ce)' : 'gray.200',
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </HStack>
            </VStack>

            <VStack align="start" spacing={3}>
              <HStack spacing={2}>
                <Icon as={FaChild} color="purple.500" />
                <Text fontWeight="medium" color="black">
                  {t("books.childAge")}
                </Text>
              </HStack>
              <HStack spacing={2} flexWrap="wrap">
                {['0-2', '2-4', '4-6', '6-8', '8+'].map((range) => (
                  <Button
                    key={range}
                    onClick={() => setAge(age === range ? null : range)}
                    borderRadius="full"
                    variant="solid"
                    size="sm"
                    px={5}
                    bg={age === range ? 'linear-gradient(to-r, #a855f7, #9333ea)' : 'gray.100'}
                    color={age === range ? 'white' : 'gray.800'}
                    _hover={{
                      bg: age === range ? 'linear-gradient(to-r, #9333ea, #7e22ce)' : 'gray.200',
                    }}
                  >
                    {range}
                  </Button>
                ))}
              </HStack>
            </VStack>
          </Flex>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={10} px={12}>
          {filteredBooks.map((book) => (
            <BookGridCard key={book.slug} {...book} />
          ))}
        </SimpleGrid>

        <AgeBrowseSection />
      </Box>
      
      {/* Bottom Banner - Right above footer */}
      <BottomBanner />
    </>
  );
}
