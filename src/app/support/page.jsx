'use client';

import { useState } from 'react';
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
  Fieldset,
  Field,
  useToken,
  createListCollection,
} from '@chakra-ui/react';
import BottomBanner from '../componets/BottomBanner';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SupportPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    email: '',
    category: '',
    message: '',
  });

  const [purple600] = useToken('colors', ['purple.600']);

  const categories = createListCollection({
    items: [
      { label: t("support.bugReport"), value: 'bug' },
      { label: t("support.featureRequest"), value: 'feature' },
      { label: t("support.accountHelp"), value: 'account' },
      { label: t("support.other"), value: 'other' },
    ],
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <>
      <Flex
        minH="100dvh"
        align="center"
        justify="center"
        p={{ base: 4, sm: 6 }}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e9d5ff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        <Box
          position="relative"
          bg="white"
          rounded="2xl"
          shadow="xl"
          w="full"
          maxW="6xl"
          overflow="hidden"
          minH={{ base: 'auto', md: '640px' }}
        >
          <Flex direction={{ base: 'column', md: 'row' }} h="100%">
            {/* LEFT — form */}
            <Box
              w={{ base: '100%', md: '50%' }}
              p={{ base: 8, sm: 12 }}
              display="flex"
              flexDirection="column"
              h="100%"
              order={{ base: 1, md: 0 }}
            >
              {/* Title */}
              <Heading as="h1" size="xl" color="gray.800" mb={4}>
                {t("support.customerSupport")}
              </Heading>
              <Text color="gray.600" mb={10}>
                {t("support.supportDescription")}
              </Text>

              <Fieldset.Root size="lg" maxW="full" spacing={6}>
                <Fieldset.Content>
                  {/* Email */}
                  <Field.Root>
                    <Field.Label color="#312e2eff">{t("support.email")}</Field.Label>
                    <Input
                      placeholder={t("support.emailPlaceholder")}
                      value={form.email}
                      onChange={handleChange('email')}
                      borderColor="gray.300"
                      color="#312e2eff"
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: `0 0 0 1px ${purple600}`,
                      }}
                    />
                  </Field.Root>

                  {/* Category */}
                  <Field.Root>
                    <Field.Label color="#312e2eff">{t("support.subject")}</Field.Label>
                    <Select.Root
                      collection={categories}
                      value={form.category}
                      onValueChange={(e) =>
                        setForm((prev) => ({ ...prev, category: e?.value ?? '' }))
                      }
                      width="full"
                      color={"black"}
                    >
                      <Select.HiddenSelect />
                      <Select.Control mb={1}>
                        <Select.Trigger borderColor="gray.300" _focusVisible={{
                          borderColor: 'purple.500',
                          boxShadow: `0 0 0 1px ${purple600}`,
                        }}>
                          <Select.ValueText placeholder={t("support.subjectPlaceholder")} />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>

                      <Portal>
                        <Select.Positioner>
                          <Select.Content
                            bg="white"
                            color={"#413e3eff"}
                            borderColor="gray.200"
                            boxShadow="md"
                            borderRadius="md"
                          >
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
                  </Field.Root>

                  {/* Message */}
                  <Field.Root>
                    <Field.Label color="#312e2eff">{t("support.message")}</Field.Label>
                    <Textarea
                      placeholder={t("support.messagePlaceholder")}
                      rows={6}
                      value={form.message}
                      onChange={handleChange('message')}
                      borderColor="gray.300"
                      color="#312e2eff"
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: `0 0 0 1px ${purple600}`,
                      }}
                    />
                  </Field.Root>
                </Fieldset.Content>

                <Button
                  type="button"
                  bg="#3e1779ff"
                  _hover={{ bg: '#7a18d6ff' }}
                  w="full"
                  size="lg"
                  mt={2}
                  onClick={() => {
                    // TODO: submit to your support endpoint
                    // await submitSupport(form)
                  }}
                >
                  <Text color="white">{t("support.sendMessage")}</Text>
                </Button>
              </Fieldset.Root>
            </Box>

            {/* RIGHT — illustration */}
            <Flex
              w={{ base: '100%', md: '50%' }}
              align="center"
              justify="center"
              p={{ base: 6, md: 12 }}
              bgGradient="linear(to-br, purple.50, white)"
              textAlign="center"
              order={{ base: 2, md: 0 }}
            >
              <Box w="full" maxW={{ base: '22rem', sm: '28rem', md: '28rem' }}>
                <Heading size="xl" color="gray.800" mb={{ base: 6, md: 8 }}>
                  {t("support.responseTime")}
                </Heading>
                <Image
                  alt="Support Graphic"
                  src="/fairytale.png"
                  w="100%"
                  h="auto"
                  rounded="lg"
                  shadow="md"
                />
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      
      {/* Bottom Banner - Right above footer */}
      <BottomBanner />
    </>
  );
}
