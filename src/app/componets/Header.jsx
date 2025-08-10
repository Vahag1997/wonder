'use client';

import {
  Box,
  Flex,
  HStack,
  Text,
  Icon,
  Image,
  Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaLock, FaUser } from 'react-icons/fa';
import { navItems } from '../constants';

export default function Header() {
  const pathname = usePathname();

  return (
    <Box
      as="header"
      bg="linear-gradient(to bottom, #1e0a3c, #2b1055)"
      px={{ base: 4, md: 8 }}
      py={4}
      position="sticky"
      top={0}
      zIndex={50}
      boxShadow="lg"
    >
      {/* Star background */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="radial-gradient(#fff 1px, transparent 1px)"
        backgroundSize="20px 20px"
        opacity={0.06}
        zIndex={0}
      />

      <Flex
        justify="space-between"
        align="center"
        maxW="8xl"
        mx="auto"
        w="100%"
        position="relative"
        zIndex={1}
      >
        {/* Logo */}
        <HStack gap={3}>
          <Image src="/dog.svg" alt="Logo" boxSize="32px" />
          <Text
            fontWeight="bold"
            fontSize="lg"
            lineHeight="18px"
            color="white"
            fontFamily="heading"
          >
            Wonder
            <br />
            Wraps
          </Text>
        </HStack>

        {/* Navigation */}
        <HStack gap={8} as="nav" display={{ base: 'none', md: 'flex' }}>
          {navItems.map(({ label, href }) => (
            <Link key={href} href={href}>
              <Flex align="center" position="relative">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  borderBottom={pathname === href ? '2px solid #a855f7' : 'none'}
                  pb="1"
                  _hover={{ color: '#a855f7' }}
                  transition="color 0.2s"
                >
                  {label}
                </Text>
              </Flex>
            </Link>
          ))}
        </HStack>

        {/* Right Side */}
        <HStack spacing={4}>
          <Button
            variant="outline"
            size="sm"
            fontSize="sm"
            borderColor="whiteAlpha.300"
            color="white"
            leftIcon={
              <Image
                src="https://flagcdn.com/w40/am.png"
                alt="Flag"
                boxSize="18px"
                borderRadius="2px"
              />
            }
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            USD
          </Button>

          <Icon as={FaLock} boxSize={4} color="whiteAlpha.900" />

          {/* User Icon navigates to login */}
          <Link href="/login">
            <HStack spacing={1} cursor="pointer" px={2} py={1}>
              <Icon as={FaUser} boxSize={4} color="whiteAlpha.900" />
              <Text fontSize="sm" color="whiteAlpha.900">User</Text>
            </HStack>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}
