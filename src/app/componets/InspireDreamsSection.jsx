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

export default function InspireDreamsSection() {
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
          pt={{ base: 16, md: 16 }}
          px={{ base: 8, md: 16, xl: 32 }}
          gap={8}
          textAlign={{ base: 'center', md: 'left' }}
          alignItems={{ base: 'center', md: 'start' }}
        >
          <VStack
            align={{ base: 'center', md: 'start' }}
            spacing={6}
          >
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="extrabold"
              fontFamily="sans"
              letterSpacing="3px"
              lineHeight={{ base: 'normal', md: '5' }}
              textTransform="uppercase"
              color="gray.800"
            >
              PERSONALISED STORIES THAT CELEBRATE THEIR BIG DREAMS
            </Text>
            
            <Heading
              as="h1"
              fontSize={{ base: '28px', md: '34px' }}
              lineHeight={{ base: '10', md: '44px' }}
              fontFamily="marcellus, serif"
              color="gray.800"
              textAlign={{ base: 'center', md: 'left' }}
            >
              Inspire Their Dreams with Hyper-personalised Career Adventures!
            </Heading>
          </VStack>

          <Link href="/books">
            <Button
              bg="#E6F9F2"
              _hover={{ bg: 'rgba(230, 249, 242, 0.8)' }}
              color="#61C8A4"
              fontWeight="bold"
              py="14px"
              px="26px"
              fontSize="sm"
              borderRadius="md"
              transition="all 0.2s"
            >
              Explore
            </Button>
          </Link>
        </Box>

        {/* Right Images Section */}
        <Box
          w={{ base: 'full', md: '3/5', lg: 'full' }}
          p={{ base: 7, md: 14, xl: 14 }}
        >
          {/* Top Row - Firefighter and Police Officer */}
          <Flex
            w="full"
            justify="space-between"
            px={{ base: 0, xl: 10 }}
            mb={4}
          >
            {/* Firefighter */}
            <Box position="relative">
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/firefighter.png"
                alt="Firefighter"
                borderRadius="full"
                w={{ base: '97.56px', md: '122px' }}
                h={{ base: '97.56px', md: '122px' }}
                objectFit="cover"
                flexShrink={0}
              />
              <Text
                fontFamily="mynerve, cursive"
                fontSize={{ base: 'lg', md: '28px' }}
                textAlign="center"
                mt={2}
                color="gray.800"
              >
                Firefighter
              </Text>
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow4.svg"
                alt="Arrow"
                position="absolute"
                left={{ base: '24', md: '32' }}
                bottom={{ base: '-5', md: '-14' }}
                w={{ base: '14', sm: '24' }}
                h={{ base: '14', sm: '24' }}
              />
            </Box>

            {/* Police Officer */}
            <Box position="relative">
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow5.svg"
                alt="Arrow"
                position="absolute"
                top="20"
                right={{ base: '-12', sm: '-20' }}
                w={{ base: '12', sm: '16' }}
                h={{ base: '12', sm: '16' }}
                zIndex={1}
              />
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/police.png"
                alt="Police Officer"
                borderRadius="full"
                w={{ base: '97.56px', md: '146px' }}
                h={{ base: '97.56px', md: '146px' }}
                objectFit="cover"
                flexShrink={0}
              />
              <Text
                fontFamily="mynerve, cursive"
                fontSize={{ base: 'lg', md: '28px' }}
                textAlign="center"
                mt={2}
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
            mb={4}
          >
            <Image
              src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child.png"
              alt="Child"
              borderRadius="full"
              w="120px"
              h="120px"
              objectFit="cover"
              flexShrink={0}
              position="relative"
              top={{ base: 4, md: 0 }}
            />
          </Flex>

          {/* Bottom Row - Pilot and Doctor */}
          <Flex
            w="full"
            justify="space-between"
            px={{ base: 0, xl: 16 }}
          >
            {/* Pilot */}
            <Box position="relative">
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow6.svg"
                alt="Arrow"
                position="absolute"
                left={{ base: '20', sm: '28' }}
                bottom={{ base: '-6', sm: '-12' }}
                w={{ base: '12', sm: '16' }}
                h={{ base: '12', sm: '16' }}
                zIndex={1}
              />
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/pilot.png"
                alt="Pilot"
                borderRadius="full"
                w={{ base: '97.56px', md: '134px' }}
                h={{ base: '97.56px', md: '134px' }}
                objectFit="cover"
                flexShrink={0}
              />
              <Text
                fontFamily="mynerve, cursive"
                fontSize={{ base: 'lg', md: '28px' }}
                textAlign="center"
                mt={2}
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
                bottom={{ base: '-6', sm: '-8' }}
                right={{ base: '-6', sm: '-8' }}
                w={{ base: '9', sm: '12' }}
                h={{ base: '9', sm: '12' }}
                zIndex={1}
              />
              <Image
                src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/doctor.png"
                alt="Doctor"
                borderRadius="full"
                w={{ base: '97.56px', md: '142px' }}
                h={{ base: '97.56px', md: '142px' }}
                objectFit="cover"
                flexShrink={0}
              />
              <Text
                fontFamily="mynerve, cursive"
                fontSize={{ base: 'lg', md: '28px' }}
                textAlign="center"
                mt={2}
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
