'use client';

import {
  Box,
  Flex,
  HStack,
  Text,
  Icon,
  Image,
  Button,
  Menu,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaLock, FaUser, FaSignOutAlt, FaBook, FaShoppingCart, FaUserCog } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getNavItems } from '../constants';

export default function Header() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();
console.log(currentLanguage,"language");

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLanguageChange = (language) => {
    changeLanguage(language);
  };

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
          {getNavItems(t).map(({ label, href }) => (
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

          {/* Language Switcher */}
          <HStack spacing={2}>
            <Button
              variant="ghost"
              size="sm"
              p={2}
              minW="auto"
              onClick={() => handleLanguageChange('en')}
              _hover={{ bg: 'whiteAlpha.100' }}
              _focus={{ bg: 'whiteAlpha.100' }}
              _active={{ bg: 'whiteAlpha.100' }}
              opacity={currentLanguage === 'en' ? 1 : 0.7}
              border={currentLanguage === 'en' ? '2px solid white' : '2px solid transparent'}
            >
              <Image
                src="https://flagcdn.com/w40/gb.png"
                alt="English"
                boxSize="20px"
                borderRadius="2px"
                title="English"
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              p={2}
              minW="auto"
              onClick={() => handleLanguageChange('ru')}
              _hover={{ bg: 'whiteAlpha.100' }}
              _focus={{ bg: 'whiteAlpha.100' }}
              _active={{ bg: 'whiteAlpha.100' }}
              opacity={currentLanguage === 'ru' ? 1 : 0.7}
              border={currentLanguage === 'ru' ? '2px solid white' : '2px solid transparent'}
            >
              <Image
                src="https://flagcdn.com/w40/ru.png"
                alt="Russian"
                boxSize="20px"
                borderRadius="2px"
                title="Русский"
              />
            </Button>
          </HStack>

          <Icon as={FaLock} boxSize={4} color="whiteAlpha.900" />

          {/* User Menu */}
          {!loading && (
            <>
              {user ? (
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.100' }}
                      _focus={{ bg: 'whiteAlpha.100' }}
                      _active={{ bg: 'whiteAlpha.100' }}
                    >
                      <HStack spacing={2}>
                        <Icon as={FaUser} boxSize={4} color="white" />
                        <Text fontSize="sm" color="white" fontWeight="medium">
                          {user.user_metadata?.name || user.email?.split('@')[0]}
                        </Text>
                      </HStack>
                    </Button>
                  </Menu.Trigger>
                  <Menu.Positioner>
                    <Menu.Content
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                      boxShadow="xl"
                      py={2}
                      minW="200px"
                    >
                      <Menu.Item 
                        value="my-account" 
                        asChild
                        _hover={{ bg: 'purple.50' }}
                        _focus={{ bg: 'purple.50' }}
                      >
                        <Link href="/account">
                          <Icon as={FaUserCog} mr={3} color="purple.600" />
                          <Text color="gray.700" fontWeight="medium">{t("auth.myAccount")}</Text>
                        </Link>
                      </Menu.Item>
                      <Menu.Item 
                        value="my-books" 
                        asChild
                        _hover={{ bg: 'purple.50' }}
                        _focus={{ bg: 'purple.50' }}
                      >
                        <Link href="/my-books">
                          <Icon as={FaBook} mr={3} color="purple.600" />
                          <Text color="gray.700" fontWeight="medium">{t("auth.myBooks")}</Text>
                        </Link>
                      </Menu.Item>
                      <Menu.Item 
                        value="orders" 
                        asChild
                        _hover={{ bg: 'purple.50' }}
                        _focus={{ bg: 'purple.50' }}
                      >
                        <Link href="/orders">
                          <Icon as={FaShoppingCart} mr={3} color="purple.600" />
                          <Text color="gray.700" fontWeight="medium">{t("auth.orders")}</Text>
                        </Link>
                      </Menu.Item>
                      <Menu.Item 
                        value="signout" 
                        onClick={handleSignOut}
                        _hover={{ bg: 'red.50' }}
                        _focus={{ bg: 'red.50' }}
                      >
                        <Icon as={FaSignOutAlt} mr={3} color="red.500" />
                        <Text color="red.600" fontWeight="medium">{t("auth.signOut")}</Text>
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Menu.Root>
              ) : (
                <Link href="/login">
                  <HStack spacing={1} cursor="pointer" px={2} py={1}>
                    <Icon as={FaUser} boxSize={4} color="whiteAlpha.900" />
                    <Text fontSize="sm" color="whiteAlpha.900">{t("auth.signIn")}</Text>
                  </HStack>
                </Link>
              )}
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
