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
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <Box
      bg="#00BFFF"
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
            <Image src="/fairytale.png" alt="WonderWraps" h={8} />
            <Text fontWeight="bold" fontSize="lg" color="white">
              wonder
              <br />
              wraps
            </Text>
          </HStack>
          <Text fontSize="sm" color="whiteAlpha.700">
            {t("footer.aboutDescription")}
          </Text>

          <HStack gap={4} mt={4}>
            <Link href="#">
              <Icon as={FaFacebookF} boxSize={5} color="whiteAlpha.800" _hover={{ color: '#00BFFF' }} />
            </Link>
            <Link href="#">
              <Icon as={FaInstagram} boxSize={5} color="whiteAlpha.800" _hover={{ color: '#00BFFF' }} />
            </Link>
            <Link href="#">
              <Icon as={FaTiktok} boxSize={5} color="whiteAlpha.800" _hover={{ color: '#00BFFF' }} />
            </Link>
          </HStack>
        </Box>

        {/* About */}
        <VStack align="start" gap={2}>
          <Text fontWeight="semibold" color="white">
            {t("footer.aboutUs")}
          </Text>
          <FooterLink label={t("footer.contactUs")} />
          <FooterLink label={t("footer.faq")} />
          <FooterLink label={t("nav.books")} />
        </VStack>

        {/* Customer Area */}
        <VStack align="start" gap={2}>
          <Text fontWeight="semibold" color="white">
            {t("footer.customerArea")}
          </Text>
          <FooterLink label={t("auth.myAccount")} />
          <FooterLink label={t("nav.orders")} />
          <FooterLink label={t("footer.termsOfService")} />
          <FooterLink label={t("footer.privacyPolicy")} />
        </VStack>

        {/* Newsletter */}
        <Box maxW="280px">
          <Text fontWeight="semibold" color="white" mb={1}>
            {t("footer.newsletter")}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700" mb={4}>
            {t("footer.newsletterDescription")}
          </Text>
          <HStack>
            <Input
              placeholder={t("footer.emailPlaceholder")}
              size="sm"
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.300"
              color="white"
              _placeholder={{ color: 'whiteAlpha.600' }}
              _focus={{ borderColor: '#00BFFF' }}
            />
            <Button
              bg="linear-gradient(to right, #00BFFF, #0099CC)"
              color="white"
              _hover={{ bg: '#0099CC' }}
              size="sm"
            >
              {t("footer.subscribe")}
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
      _hover={{ color: '#00BFFF' }}
    >
      {label}
    </Link>
  );
}
