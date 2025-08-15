'use client';

import { useAuth } from '../contexts/AuthContext';
import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react';

export default function GlobalLoading({ children }) {
  const { initialized } = useAuth();

  // Show loading spinner until authentication is initialized
  if (!initialized) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.600" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  // Once initialized, render the app
  return children;
}
