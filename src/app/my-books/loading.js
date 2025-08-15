import { Box, Center, Spinner, VStack, Text } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
      <Center py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.600" thickness="4px" />
          <Text fontSize="lg" color="gray.600">Loading your personalized books...</Text>
        </VStack>
      </Center>
    </Box>
  );
}
