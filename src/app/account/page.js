'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Avatar,
  Spinner,
  Card,
  Icon,
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabaseClient';
import { FaSignOutAlt, FaEdit } from 'react-icons/fa';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!ready) {
    return (
      <Box minH="100dvh" bg="white" display="flex" alignItems="center" justifyContent="center" px={4}>
        <VStack spacing={6}>
          <Spinner size="xl" color="purple.600" thickness="4px" />
          <Text color="purple.700" fontSize={{ base: "md", md: "lg" }} fontWeight="medium" textAlign="center">
            Loading your account...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box minH="100dvh" bg="white" display="flex" alignItems="center" justifyContent="center" px={4}>
        <Container maxW="md">
          <Card.Root shadow="xl" borderRadius="2xl" border="1px solid" borderColor="purple.200">
            <Card.Body p={{ base: 8, md: 12 }}>
              <VStack spacing={8}>
                <VStack spacing={4}>
                  <Heading size={{ base: "lg", md: "xl" }} textAlign="center" color="green.800" fontWeight="bold">
                    Authentication Required
                  </Heading>
                  <Text color="gray.600" textAlign="center" fontSize={{ base: "sm", md: "md" }}>
                    Please sign in to access your account dashboard
                  </Text>
                </VStack>

                <Link href="/login" style={{ width: '100%' }}>
                  <Button 
                    bg="purple.600" 
                    color="white" 
                    size={{ base: "md", md: "lg" }}
                    w="full" 
                    h={{ base: "10", md: "12" }}
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="semibold"
                    borderRadius="xl"
                    _hover={{ bg: 'purple.700' }}
                    _active={{ bg: 'purple.800' }}
                  >
                    Sign In
                  </Button>
                </Link>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Container>
      </Box>
    );
  }

  const fullName = user.user_metadata?.full_name || '';
  const email = user.email || '';

  return (
    <Box minH="100dvh" py={{ base: 6, md: 12 }} px={4}>
      <Container maxW="4xl">
        <VStack spacing={{ base: 6, md: 8 }}>
          {/* Profile Card */}
          <Card.Root w="full" maxW="md" shadow="xl" borderRadius="2xl" bg="white" border="1px solid" borderColor="gray.700">
            <Card.Body p={{ base: 6, md: 8 }}>
              <VStack spacing={{ base: 5, md: 6 }} align="center">
                {/* Title */}
                <Heading size={{ base: "md", md: "lg" }} color="gray.200" fontWeight="bold" alignSelf="flex-start">
                  Profile
                </Heading>

                {/* Avatar */}
                <Box position="relative">
                  <Avatar.Root 
                    size={{ base: "xl", md: "2xl" }}
                    colorPalette="purple"
                  >
                    <Avatar.Fallback name={fullName || email} />
                  </Avatar.Root>
                  <Box
                    position="absolute"
                    bottom="2"
                    right="2"
                    bg="green.500"
                    p={1}
                    rounded="full"
                    border="3px solid"
                    borderColor="white"
                  >
                    <Box w="2" h="2" bg="white" rounded="full" />
                  </Box>
                </Box>

                {/* User Info */}
                <VStack spacing={2} align="center">
                  <Heading size={{ base: "sm", md: "md" }} color="gray.200" fontWeight="bold" textAlign="center">
                    {fullName || 'Welcome Back'}
                  </Heading>
                  <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }} textAlign="center">
                    {email}
                  </Text>
                </VStack>

                {/* Edit Button */}
                <Button
                  leftIcon={<Icon as={FaEdit} />}
                  bg="purple.600"
                  color="white"
                  size={{ base: "md", md: "lg" }}
                  w="full"
                  h={{ base: "10", md: "12" }}
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="semibold"
                  borderRadius="xl"
                  _hover={{ bg: 'purple.700' }}
                  _active={{ bg: 'purple.800' }}
                >
                  Edit
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Sign Out Button */}
          <Button
            leftIcon={<Icon as={FaSignOutAlt} />}
            bg="red.500"
            color="white"
            size={{ base: "md", md: "lg" }}
            w="full"
            maxW="md"
            h={{ base: "10", md: "12" }}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="semibold"
            borderRadius="xl"
            onClick={signOut}
            isLoading={isSigningOut}
            loadingText="Signing out..."
            _hover={{ bg: 'red.600' }}
            _active={{ bg: 'red.700' }}
          >
            Sign Out
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
