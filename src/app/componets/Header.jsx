'use client';

import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
  Image,
  Button,
  Menu,
  IconButton,
  Drawer,
  Portal,
  Separator,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaBook, FaShoppingCart, FaUserCog, FaBars } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getNavItems } from '../constants';

export default function Header() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();

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
    <>
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
          <Link href="/">
            <HStack gap={3} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
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
          </Link>

          {/* Desktop Navigation */}
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

            {/* Language Switcher - Hidden on mobile */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  p={2}
                  minW="auto"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  _focus={{ bg: 'whiteAlpha.100' }}
                  _active={{ bg: 'whiteAlpha.100' }}
                  display={{ base: 'none', md: 'flex' }}
                >
                  <HStack spacing={2}>
                    <Image
                      src={currentLanguage === 'en' ? "https://flagcdn.com/w40/us.png" : "https://flagcdn.com/w40/ru.png"}
                      alt={currentLanguage === 'en' ? "English" : "Russian"}
                      boxSize="20px"
                      borderRadius="2px"
                    />
                    <Text fontSize="sm" color="white" fontWeight="medium">
                      {currentLanguage === 'en' ? 'EN' : 'RU'}
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
                  minW="150px"
                >
                  <Menu.Item
                    value="english"
                    onClick={() => handleLanguageChange('en')}
                    _hover={{ bg: 'purple.50' }}
                    _focus={{ bg: 'purple.50' }}
                  >
                    <HStack spacing={3}>
                      <Image
                        src="https://flagcdn.com/w40/us.png"
                        alt="English"
                        boxSize="20px"
                        borderRadius="2px"
                      />
                      <Text color="gray.700" fontWeight="medium">English</Text>
                      {currentLanguage === 'en' && (
                        <Box ml="auto" color="purple.600">
                          ✓
                        </Box>
                      )}
                    </HStack>
                  </Menu.Item>
                  <Menu.Item
                    value="russian"
                    onClick={() => handleLanguageChange('ru')}
                    _hover={{ bg: 'purple.50' }}
                    _focus={{ bg: 'purple.50' }}
                  >
                    <HStack spacing={3}>
                      <Image
                        src="https://flagcdn.com/w40/ru.png"
                        alt="Russian"
                        boxSize="20px"
                        borderRadius="2px"
                      />
                      <Text color="gray.700" fontWeight="medium">Русский</Text>
                      {currentLanguage === 'ru' && (
                        <Box ml="auto" color="purple.600">
                          ✓
                        </Box>
                      )}
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            {/* Desktop User Menu */}
            {!loading && (
              <Box display={{ base: 'none', md: 'block' }}>
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
              </Box>
            )}

            {/* Mobile Burger Menu */}
            <Drawer.Root size="full" placement="end">
              <Drawer.Trigger asChild>
                <IconButton
                  display={{ base: 'flex', md: 'none' }}
                  variant="ghost"
                  color="white"
                  aria-label="Open menu"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  _focus={{ bg: 'whiteAlpha.100' }}
                  _active={{ bg: 'whiteAlpha.100' }}
                >
                  <FaBars />
                </IconButton>
              </Drawer.Trigger>
              <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                  <Drawer.Content bg="linear-gradient(to bottom, #1e0a3c, #2b1055)">
                    <Drawer.Header borderBottomWidth="1px" borderColor="whiteAlpha.200">
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
                    </Drawer.Header>
                    <Drawer.Body p={0}>
                      <Drawer.Context>
                        {(store) => (
                          <VStack spacing={0} align="stretch" h="full">
                            {/* Navigation Items */}
                            <VStack spacing={0} align="stretch" flex={1}>
                              {getNavItems(t).map(({ label, href }) => (
                                <Box
                                  key={href}
                                  as="button"
                                  w="full"
                                  textAlign="center"
                                  px={6}
                                  py={5}
                                  borderBottom="1px solid"
                                  borderColor="whiteAlpha.200"
                                  _hover={{ bg: 'whiteAlpha.100' }}
                                  bg={pathname === href ? 'whiteAlpha.100' : 'transparent'}
                                  onClick={() => {
                                    store.setOpen(false);
                                    window.location.href = href;
                                  }}
                                >
                                  <Text
                                    fontSize="lg"
                                    fontWeight="medium"
                                    color="white"
                                    borderLeft={pathname === href ? '4px solid #a855f7' : 'none'}
                                    pl={pathname === href ? 4 : 0}
                                    textAlign="center"
                                  >
                                    {label}
                                  </Text>
                                </Box>
                              ))}
                            </VStack>

                            <Separator borderColor="whiteAlpha.200" />

                            {/* Language Switcher */}
                            <VStack spacing={4} p={6}>
                              <Text fontSize="md" fontWeight="medium" color="whiteAlpha.800" alignSelf="start">
                                Language
                              </Text>
                              <HStack spacing={3} w="full">
                                <Button
                                  variant="outline"
                                  size="lg"
                                  flex={1}
                                  borderColor={currentLanguage === 'en' ? '#a855f7' : 'whiteAlpha.300'}
                                  color="white"
                                  onClick={() => handleLanguageChange('en')}
                                  _hover={{ bg: 'whiteAlpha.100' }}
                                  leftIcon={
                                    <Image
                                      src="https://flagcdn.com/w40/us.png"
                                      alt="English"
                                      boxSize="24px"
                                      borderRadius="2px"
                                    />
                                  }
                                >
                                  <Text fontSize="md">English</Text>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="lg"
                                  flex={1}
                                  borderColor={currentLanguage === 'ru' ? '#a855f7' : 'whiteAlpha.300'}
                                  color="white"
                                  onClick={() => handleLanguageChange('ru')}
                                  _hover={{ bg: 'whiteAlpha.100' }}
                                  leftIcon={
                                    <Image
                                      src="https://flagcdn.com/w40/ru.png"
                                      alt="Russian"
                                      boxSize="24px"
                                      borderRadius="2px"
                                    />
                                  }
                                >
                                  <Text fontSize="md">Русский</Text>
                                </Button>
                              </HStack>
                            </VStack>

                            <Separator borderColor="whiteAlpha.200" />

                            {/* User Section */}
                            <VStack spacing={4} p={6}>
                              {!loading && (
                                <>
                                  {user ? (
                                    <VStack spacing={4} w="full">
                                      {/* User Profile Card */}
                                      <Box
                                        w="full"
                                        p={4}
                                        bg="whiteAlpha.100"
                                        borderRadius="xl"
                                        border="1px solid"
                                        borderColor="whiteAlpha.200"
                                        backdropFilter="blur(10px)"
                                      >
                                        <HStack spacing={3} align="center" justify="center">
                                          {/* User Avatar */}
                                          <Box
                                            w="48px"
                                            h="48px"
                                            borderRadius="full"
                                            bg="purple.500"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            boxShadow="0 4px 12px rgba(124, 58, 237, 0.3)"
                                          >
                                            <Icon as={FaUser} boxSize={5} color="white" />
                                          </Box>

                                          {/* User Info */}
                                          <VStack spacing={1} align="center" flex={1}>
                                            <Text
                                              fontSize="lg"
                                              fontWeight="semibold"
                                              color="white"
                                              noOfLines={1}
                                              textAlign="center"
                                            >
                                              {user.user_metadata?.name || user.email?.split('@')[0]}
                                            </Text>
                                            <Text
                                              fontSize="md"
                                              color="whiteAlpha.700"
                                              noOfLines={1}
                                              textAlign="center"
                                            >
                                              {user.email}
                                            </Text>
                                          </VStack>
                                        </HStack>
                                      </Box>

                                      {/* Navigation Buttons */}
                                      <VStack spacing={2} w="full">
                                        <Button
                                          variant="ghost"
                                          size="lg"
                                          w="full"
                                          justifyContent="center"
                                          color="white"
                                          _hover={{ bg: 'whiteAlpha.100' }}
                                          _active={{ bg: 'whiteAlpha.200' }}
                                          leftIcon={<Icon as={FaUserCog} boxSize={5} />}
                                          onClick={() => {
                                            store.setOpen(false);
                                            window.location.href = '/account';
                                          }}
                                        >
                                          <Text fontSize="md">{t("auth.myAccount")}</Text>
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="lg"
                                          w="full"
                                          justifyContent="center"
                                          color="white"
                                          _hover={{ bg: 'whiteAlpha.100' }}
                                          _active={{ bg: 'whiteAlpha.200' }}
                                          leftIcon={<Icon as={FaBook} boxSize={5} />}
                                          onClick={() => {
                                            store.setOpen(false);
                                            window.location.href = '/my-books';
                                          }}
                                        >
                                          <Text fontSize="md">{t("auth.myBooks")}</Text>
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="lg"
                                          w="full"
                                          justifyContent="center"
                                          color="white"
                                          _hover={{ bg: 'whiteAlpha.100' }}
                                          _active={{ bg: 'whiteAlpha.200' }}
                                          leftIcon={<Icon as={FaShoppingCart} boxSize={5} />}
                                          onClick={() => {
                                            store.setOpen(false);
                                            window.location.href = '/orders';
                                          }}
                                        >
                                          <Text fontSize="md">{t("auth.orders")}</Text>
                                        </Button>

                                        {/* Sign Out Button with better styling */}
                                        <Box w="full" pt={2}>
                                          <Button
                                            variant="outline"
                                            size="lg"
                                            w="full"
                                            justifyContent="center"
                                            color="red.300"
                                            borderColor="red.400"
                                            _hover={{
                                              bg: 'red.500',
                                              borderColor: 'red.500',
                                              color: 'white'
                                            }}
                                            _active={{ bg: 'red.600' }}
                                            leftIcon={<Icon as={FaSignOutAlt} boxSize={5} />}
                                            onClick={async () => {
                                              await handleSignOut();
                                              store.setOpen(false);
                                            }}
                                          >
                                            <Text fontSize="md">{t("auth.signOut")}</Text>
                                          </Button>
                                        </Box>
                                      </VStack>
                                    </VStack>
                                  ) : (
                                    <VStack spacing={4} w="full">
                                      {/* Guest User Card */}
                                      <Box
                                        w="full"
                                        p={4}
                                        bg="whiteAlpha.100"
                                        borderRadius="xl"
                                        border="1px solid"
                                        borderColor="whiteAlpha.200"
                                        backdropFilter="blur(10px)"
                                      >
                                        <HStack spacing={3} align="center" justify="center">
                                          <Box
                                            w="48px"
                                            h="48px"
                                            borderRadius="full"
                                            bg="gray.500"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                          >
                                            <Icon as={FaUser} boxSize={5} color="white" />
                                          </Box>
                                          <VStack spacing={1} align="center" flex={1}>
                                            <Text
                                              fontSize="lg"
                                              fontWeight="semibold"
                                              color="white"
                                              textAlign="center"
                                            >
                                              Guest User
                                            </Text>
                                            <Text
                                              fontSize="md"
                                              color="whiteAlpha.700"
                                              textAlign="center"
                                            >
                                              Sign in to access your account
                                            </Text>
                                          </VStack>
                                        </HStack>
                                      </Box>

                                      {/* Sign In Button */}
                                      <Button
                                        variant="solid"
                                        size="lg"
                                        w="full"
                                        bg="purple.500"
                                        color="white"
                                        _hover={{ bg: 'purple.600' }}
                                        _active={{ bg: 'purple.700' }}
                                        leftIcon={<Icon as={FaUser} boxSize={5} />}
                                        onClick={() => {
                                          store.setOpen(false);
                                          window.location.href = '/login';
                                        }}
                                      >
                                        <Text fontSize="md">{t("auth.signIn")}</Text>
                                      </Button>
                                    </VStack>
                                  )}
                                </>
                              )}
                            </VStack>
                          </VStack>
                        )}
                      </Drawer.Context>
                    </Drawer.Body>
                    <Drawer.CloseTrigger asChild>
                      <Button
                        position="absolute"
                        top={4}
                        right={4}
                        variant="ghost"
                        color="white"
                        size="lg"
                        _hover={{ bg: 'whiteAlpha.100' }}
                      >
                        ✕
                      </Button>
                    </Drawer.CloseTrigger>
                  </Drawer.Content>
                </Drawer.Positioner>
              </Portal>
            </Drawer.Root>
          </HStack>
        </Flex>
      </Box>
    </>
  );
}
