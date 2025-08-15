'use client';

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BottomBanner() {
  const { t } = useLanguage();

  return (
    <Box
      as="section"
      bg="gray.50"
      pt={{ base: 12, md: 16 }}
      pb={0}
      position="relative"
      overflow="hidden"
      w="100vw"
      left="50%"
      right="50%"
      ml="-50vw"
      mr="-50vw"
      sx={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      }}
    >
      <Box
        w="full"
        px={0}
      >
        <Box
          bg="white"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="0 10px 25px rgba(0, 0, 0, 0.1)"
          position="relative"
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            minH={{ base: "auto", lg: "320px" }}
          >
            {/* Left Side - Image */}
            <Box
              w={{ base: "full", lg: "55%" }}
              position="relative"
              overflow="hidden"
            >
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/reading_book.png"
                alt="Child reading a personalized book in a cozy teepee"
                w="full"
                h="full"
                objectFit="cover"
                objectPosition="center"
              />
              
              {/* Gradient Overlay */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bgGradient="linear(to-r, rgba(0,0,0,0.1), transparent)"
                opacity="0.3"
              />
            </Box>

            {/* Right Side - Content */}
            <Box
              w={{ base: "full", lg: "45%" }}
              bg="white"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              px={{ base: 6, md: 10, lg: 14 }}
              py={{ base: 10, md: 12 }}
              position="relative"
            >
              {/* Purple Accent Line */}
              <Box
                position="absolute"
                left="0"
                top="0"
                bottom="0"
                w="4px"
                bgGradient="linear(to-b, purple.400, purple.600)"
              />
              
              <VStack
                align="start"
                spacing={5}
                w="full"
              >
                {/* Badge */}
                <Box
                  bg="purple.50"
                  color="purple.700"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="semibold"
                  letterSpacing="wide"
                >
                  {t("banners.personalizedStories")}
                </Box>

                <Heading
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl", lg: "3xl" }}
                  lineHeight="1.2"
                  fontWeight="bold"
                  color="gray.900"
                  fontFamily="marcellus, serif"
                >
                  {t("banners.bringImaginationToLife")}
                </Heading>
                
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.6"
                  color="gray.600"
                  maxW="500px"
                  fontWeight="medium"
                >
                  {t("banners.imaginationDescription")}
                </Text>
                
                <Box pt={1}>
                  <Link href="/books">
                    <Button
                      bg="purple.600"
                      color="white"
                      py={3}
                      px={6}
                      borderRadius="lg"
                      fontWeight="bold"
                      fontSize="md"
                      _hover={{ 
                        bg: 'purple.700',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(147, 51, 234, 0.3)'
                      }}
                      _active={{ transform: 'translateY(0)' }}
                      transition="all 0.3s ease"
                      boxShadow="0 4px 15px rgba(147, 51, 234, 0.2)"
                    >
                      {t("books.viewAllBooks")}
                    </Button>
                  </Link>
                </Box>

                {/* Trust Indicators */}
                <Flex
                  align="center"
                  gap={6}
                  pt={3}
                  color="gray.500"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  <Flex align="center" gap={2}>
                    <Box w="2" h="2" bg="green.400" borderRadius="full" />
                    <Text>{t("banners.trustIndicator1")}</Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Box w="2" h="2" bg="blue.400" borderRadius="full" />
                    <Text>{t("banners.trustIndicator2")}</Text>
                  </Flex>
                </Flex>
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
