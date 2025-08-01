'use client';

import {
  Box,
  Flex,
  Stack,
  Text,
  Link,
  Input,
  Button,
  Icon,
  Image,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box
      bg="linear-gradient(to bottom, #1e0a3c, #2b1055)"
      px={{ base: 4, md: 12 }}
      py={12}
      position="relative"
      overflow="hidden"
    >
      {/* Starry background effect */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="radial-gradient(#fff 1px, transparent 1px)"
        backgroundSize="20px 20px"
        opacity={0.06}
        zIndex={0}
      />

      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="flex-start"
        gap={10}
        position="relative"
        zIndex={1}
      >
        {/* Logo & About */}
        <Box maxW="250px">
          <HStack mb={3}>
            <Image src="/dog.svg" alt="WonderWraps" h={8} />
            <Text fontWeight="bold" fontSize="lg" color="white">
              wonder
              <br />
              wraps
            </Text>
          </HStack>
          <Text fontSize="sm" color="whiteAlpha.700">
            Create personalised storybooks that make your child the hero, with
            quick customisation and speedy delivery!
          </Text>

          <HStack gap={4} mt={4}>
            <Link href="#">
              <Icon as={FaFacebookF} boxSize={5} color="whiteAlpha.800" _hover={{ color: '#a855f7' }} />
            </Link>
            <Link href="#">
              <Icon as={FaInstagram} boxSize={5} color="whiteAlpha.800" _hover={{ color: '#a855f7' }} />
            </Link>
            <Link href="#">
              <Icon as={FaTiktok} boxSize={5} color="whiteAlpha.800" _hover={{ color: '#a855f7' }} />
            </Link>
          </HStack>
        </Box>

        {/* About */}
        <VStack align="start" gap={2}>
          <Text fontWeight="semibold" color="white">
            About WonderWraps
          </Text>
          <FooterLink label="Contact us" />
          <FooterLink label="FAQs" />
          <FooterLink label="Books" />
        </VStack>

        {/* Customer Area */}
        <VStack align="start" gap={2}>
          <Text fontWeight="semibold" color="white">
            Customer Area
          </Text>
          <FooterLink label="My Account" />
          <FooterLink label="Orders" />
          <FooterLink label="Terms" />
          <FooterLink label="Privacy Policy" />
        </VStack>

        {/* Newsletter */}
        <Box maxW="280px">
          <Text fontWeight="semibold" color="white" mb={1}>
            Subscribe to Our Newsletter
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700" mb={4}>
            Don’t miss out on the newest books
          </Text>
          <HStack>
            <Input
              placeholder="Enter your email address"
              size="sm"
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.300"
              color="white"
              _placeholder={{ color: 'whiteAlpha.600' }}
              _focus={{ borderColor: '#a855f7' }}
            />
            <Button
              bg="linear-gradient(to right, #a855f7, #9333ea)"
              color="white"
              _hover={{ bg: '#9333ea' }}
              size="sm"
            >
              Subscribe
            </Button>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
}

function FooterLink({ label }) {
  return (
    <Link
      href="#"
      fontSize="sm"
      color="whiteAlpha.700"
      _hover={{ color: '#a855f7' }}
    >
      {label}
    </Link>
  );
}
