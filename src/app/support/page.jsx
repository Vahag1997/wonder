'use client';

import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  Image,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { useState } from 'react';

const categories = createListCollection({
  items: [
    { label: 'Bug Report', value: 'bug' },
    { label: 'Feature Request', value: 'feature' },
    { label: 'Account Help', value: 'account' },
    { label: 'Other', value: 'other' },
  ],
});

export default function SupportPage() {
  const [form, setForm] = useState({
    email: '',
    category: '',
    message: '',
  });

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleCategoryChange = (selectedItem) =>
    setForm({ ...form, category: selectedItem?.value || '' });

  return (
    <Box
      w="full"
      minH="100vh"
      py={20}
      px={{ base: 4, md: 10 }}
      bg="white"
    >
      <Box maxW="7xl" mx="auto">
        <Heading
          textAlign="center"
          fontSize={{ base: '2xl', md: '4xl' }}
          fontWeight="semibold"
          color="gray.800"
          mb={4}
        >
          Customer Support
        </Heading>
        <Text
          textAlign="center"
          fontSize="lg"
          color="gray.600"
          maxW="2xl"
          mx="auto"
          mb={12}
        >
          We're here to help. Contact us with any questions or issues you may have.
        </Text>

        <Flex
          bg="gray.50"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          maxW="5xl"
          mx="auto"
          boxShadow="lg"
          direction={{ base: 'column', lg: 'row' }}
          gap={12}
          border="1px solid"
          borderColor="gray.200"
        >
          {/* Left Side Graphic */}
          <Box flex={1} display="flex" alignItems="center" justifyContent="center">
            <Image
              src="/dog.svg"
              alt="Support Graphic"
              width={320}
              height={320}
              style={{ objectFit: 'contain' }}
            />
          </Box>

          {/* Right Side Form */}
          <Box flex={1}>
            <Heading fontSize="2xl" fontWeight="semibold" mb={3} color="gray.800">
              Contact Our Team
            </Heading>
            <Text fontSize="md" color="gray.600" mb={8}>
              Fill out the form below and we'll get back to you as soon as possible.
            </Text>

            <Box mb={6}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Email Address
              </Text>
              <Input
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange('email')}
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                }}
                size="lg"
              />
            </Box>

            <Box mb={6}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Category
              </Text>
              <Select.Root
                collection={categories}
                value={form.category}
                onValueChange={handleCategoryChange}
                width="full"
              >
                <Select.HiddenSelect />
                <Select.Label>Select category</Select.Label>
                <Select.Control mb={4}>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select a category..." />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="white" borderColor="gray.200" boxShadow="md" borderRadius="md">
                      {categories.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>

            <Box mb={8}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Your Message
              </Text>
              <Textarea
                placeholder="Please describe your issue or question in detail..."
                rows={6}
                value={form.message}
                onChange={handleChange('message')}
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{
                  borderColor: 'purple.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                }}
                size="lg"
              />
            </Box>

            <Button
              colorScheme="purple"
              size="lg"
              px={8}
              width="full"
              fontWeight="semibold"
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: 'md',
              }}
              transition="all 0.2s"
            >
              Submit Request
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
