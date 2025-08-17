'use client';

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

export default function InspireDreamsSection() {
  const { t } = useLanguage();

  return (
    <Box
      as="section"
      w="full"
      h="auto"
      bgImage="url('https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/inspire-bg.svg')"
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center"
    >
      <Flex
        w="full"
        h="full"
        direction={{ base: 'column', md: 'row' }}
      >
        {/* Left Content Section */}
        <Box
          w={{ base: 'full', md: '2/5', lg: 'full' }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          pt={{ base: 8, md: 12 }}
          pb={{ base: 6, md: 12 }}
          px={{ base: 4, md: 12, xl: 24 }}
          gap={{ base: 4, md: 6 }}
          textAlign={{ base: 'center', md: 'left' }}
          alignItems={{ base: 'center', md: 'start' }}
        >
          <VStack
            align={{ base: 'center', md: 'start' }}
            spacing={{ base: 3, md: 4 }}
          >
            <Text
              fontSize={{ base: 'sm', md: 'sm' }}
              fontWeight="extrabold"
              fontFamily="sans"
              letterSpacing="3px"
              lineHeight={{ base: 'normal', md: '5' }}
              textTransform="uppercase"
              color="gray.800"
            >
              {t("banners.craftMagicalTales")}
            </Text>
            
            <Heading
              as="h1"
              fontSize={{ base: '20px', md: '28px' }}
              lineHeight={{ base: '26px', md: '36px' }}
              fontFamily="marcellus, serif"
              color="gray.800"
              textAlign={{ base: 'center', md: 'left' }}
            >
              {t("banners.inspireDreams")}
            </Heading>
          </VStack>

          <Link href="/books">
            <Button
              bg="#E6F9F2"
              _hover={{ bg: 'rgba(230, 249, 242, 0.8)' }}
              color="#61C8A4"
              fontWeight="bold"
              py={{ base: "10px", md: "12px" }}
              px={{ base: "16px", md: "20px" }}
              fontSize={{ base: "sm", md: "sm" }}
              borderRadius="md"
              transition="all 0.2s"
            >
              {t("books.explore")}
            </Button>
          </Link>
        </Box>

        {/* Right Images Section */}
        <Box
          w={{ base: 'full', md: '3/5', lg: 'full' }}
          p={{ base: 3, md: 10, xl: 10 }}
        >
          {/* Top Row - Firefighter and Police Officer */}
          <Flex
            w="full"
            justify="space-between"
            px={{ base: 1, xl: 8 }}
            mb={{ base: 1, md: 3 }}
          >
            {/* Firefighter */}
            <Box position="relative">
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/firefighter.png"
                alt="Firefighter"
                borderRadius="full"
                w={{ base: '65px', md: '100px' }}
                h={{ base: '65px', md: '100px' }}
                objectFit="cover"
                flexShrink={0}
              />
              <Text
                fontFamily="mynerve, cursive"
                fontSize={{ base: 'sm', md: '20px' }}
                textAlign="center"
                mt={{ base: 1, md: 1 }}
                color="gray.800"
              >
                Firefighter
              </Text>
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow4.svg"
                alt="Arrow"
                position="absolute"
                left={{ base: '16', md: '26' }}
                bottom={{ base: '-2', md: '-10' }}
                w={{ base: '10', sm: '18' }}
                h={{ base: '10', sm: '18' }}
              />
            </Box>

            {/* Police Officer */}
            <Box position="relative">
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow5.svg"
                alt="Arrow"
                position="absolute"
                top="16"
                right={{ base: '-6', sm: '-15' }}
                w={{ base: '8', sm: '12' }}
                h={{ base: '8', sm: '12' }}
                zIndex={1}
              />
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/police.png"
                alt="Police Officer"
                borderRadius="full"
                w={{ base: '65px', md: '120px' }}
                h={{ base: '65px', md: '120px' }}
                objectFit="cover"
                flexShrink={0}
              />
              <Text
                fontFamily="mynerve, cursive"
                fontSize={{ base: 'sm', md: '20px' }}
                textAlign="center"
                mt={{ base: 1, md: 1 }}
                color="gray.800"
              >
                Police Officer
              </Text>
            </Box>
          </Flex>

          {/* Center - Child */}
          <Flex
            w="full"
            justify="center"
            mb={{ base: 1, md: 3 }}
          >
            <Image
              src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child.png"
              alt="Child"
              borderRadius="full"
              w={{ base: '80px', md: '100px' }}
              h={{ base: '80px', md: '100px' }}
              objectFit="cover"
              flexShrink={0}
              position="relative"
              top={{ base: 1, md: 0 }}
            />
          </Flex>

          {/* Bottom Row - Pilot and Doctor */}
          <Flex
            w="full"
            justify="space-between"
            px={{ base: 1, xl: 12 }}
          >
            {/* Pilot */}
            <Box position="relative">
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow6.svg"
                alt="Arrow"
                position="absolute"
                left={{ base: '12', sm: '22' }}
                bottom={{ base: '-3', sm: '-8' }}
                w={{ base: '8', sm: '12' }}
                h={{ base: '8', sm: '12' }}
                zIndex={1}
              />
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/pilot.png"
                alt="Pilot"
                borderRadius="full"
                w={{ base: '65px', md: '110px' }}
                h={{ base: '65px', md: '110px' }}
                objectFit="cover"
                flexShrink={0}
              />
              <Text
                fontFamily="mynerve, cursive"
                fontSize={{ base: 'sm', md: '20px' }}
                textAlign="center"
                mt={{ base: 1, md: 1 }}
                color="gray.800"
              >
                Pilot
              </Text>
            </Box>

            {/* Doctor */}
            <Box position="relative">
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow7.svg"
                alt="Arrow"
                position="absolute"
                bottom={{ base: '-3', sm: '-6' }}
                right={{ base: '-3', sm: '-6' }}
                w={{ base: '6', sm: '10' }}
                h={{ base: '6', sm: '10' }}
                zIndex={1}
              />
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/doctor.png"
                alt="Doctor"
                borderRadius="full"
                w={{ base: '65px', md: '115px' }}
                h={{ base: '65px', md: '115px' }}
                objectFit="cover"
                flexShrink={0}
              />
              <Text
                fontFamily="mynerve, cursive"
                fontSize={{ base: 'sm', md: '20px' }}
                textAlign="center"
                mt={{ base: 1, md: 1 }}
                color="gray.800"
              >
                Doctor
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
