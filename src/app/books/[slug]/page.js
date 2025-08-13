"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  HStack,
  VStack,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import {
  LuPlay,
  LuBookOpen,
  LuBaby,
  LuPalette,
  LuGraduationCap,
} from "react-icons/lu";
import { getBookBySlug } from "../constants";
import { notFound, useParams } from "next/navigation";
import { useRouter } from 'next/navigation';

const PRIMARY = "#3B82F6";
const SECONDARY = "#FBBF24";
const TEXT_PRIMARY = "#1F2937";
const TEXT_SECONDARY = "#6B7280";

export default function SingleBookPage() {
  const { slug } = useParams();
  const book = getBookBySlug(slug);
  if (!book) return notFound();

  const thumbs = book.gallery?.thumbs ?? [];
  const defaultMain = book.gallery?.main || book.cover;
  const [activeIdx, setActiveIdx] = useState(0);
  const [language, setLanguage] = useState(book.languages?.[0] || "en");
const router = useRouter()
  const languageOptions = useMemo(
    () =>
      createListCollection({
        items: (book.languages || []).map((code) => ({
          value: code,
          label:
            code === "en"
              ? "English"
              : code === "ru"
              ? "Russian"
              : code === "fr"
              ? "French"
              : code,
        })),
      }),
    [book.languages]
  );

  const mainSrc = thumbs[activeIdx]?.src || defaultMain;

  return (
    <Box
      bg="#FFFFFF"
      color={TEXT_PRIMARY}
      py={{ base: 12, md: 16 }}
      px={{ base: 4, sm: 6, lg: 8 }}
    >
      <Box maxW="7xl" mx="auto">
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 10, lg: 16 }}
          align="start"
        >
          {/* LEFT: gallery */}
          <Flex
            direction={{ base: "column-reverse", md: "row" }}
            gap={4}
            w="full"
          >
            <Flex
              direction={{ base: "row", md: "column" }}
              gap={3}
              justify="center"
              align={{ base: "center", md: "stretch" }}
            >
              {thumbs.map((t, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <Box
                    key={idx}
                    position="relative"
                    w="20"
                    h="20"
                    rounded="lg"
                    overflow="hidden"
                    borderWidth="2px"
                    borderColor={isActive ? PRIMARY : "transparent"}
                    cursor="pointer"
                    onClick={() => setActiveIdx(idx)}
                    transition="all 0.2s"
                    boxShadow={
                      isActive ? "0 0 0 3px rgba(59,130,246,0.5)" : "none"
                    }
                    _hover={{ borderColor: PRIMARY }}
                  >
                    <Image
                      src={t.src}
                      alt="Thumbnail"
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                    {t.type === "video" && (
                      <Flex
                        position="absolute"
                        inset="0"
                        align="center"
                        justify="center"
                        opacity={0}
                        _hover={{ opacity: 1 }}
                        bg="blackAlpha.400"
                        transition="opacity 0.2s"
                      >
                        <LuPlay size={28} color="#fff" />
                      </Flex>
                    )}
                  </Box>
                );
              })}
            </Flex>

            <Box flex="1">
              <Image
                alt={`${book.title} cover`}
                src={mainSrc}
                w="full"
                h="auto"
                objectFit="cover"
                rounded="xl"
                boxShadow="lg"
              />
            </Box>
          </Flex>

          {/* RIGHT: details */}
          <VStack align="stretch" spacing={6} justify="center" w="full">
            <Heading
              as="h1"
              fontWeight="bold"
              lineHeight="tight"
              fontSize={{ base: "3xl", md: "4xl" }}
              color={TEXT_PRIMARY}
            >
              {book.title}
            </Heading>

            <Text fontSize="lg" color={TEXT_SECONDARY} lineHeight="tall">
              {book.description}
            </Text>

            <HStack align="center" spacing={3}>
              <HStack spacing={1} color={SECONDARY}>
                <Text fontSize="2xl">★</Text>
                <Text fontSize="2xl">★</Text>
                <Text fontSize="2xl">★</Text>
                <Text fontSize="2xl">★</Text>
                <Text fontSize="2xl" color="gray.300">
                  ★
                </Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium" color={TEXT_SECONDARY}>
                {book.rating} ({book.ratingCount} reviews)
              </Text>
            </HStack>

            <HStack spacing={3} align="baseline">
              <Text fontSize="4xl" fontWeight="bold" color={TEXT_PRIMARY}>
                ${book.price.toFixed(2)}
              </Text>
              {book.oldPrice ? (
                <Text fontSize="xl" color="gray.400" as="s">
                  ${book.oldPrice.toFixed(2)}
                </Text>
              ) : null}
            </HStack>

            <Box
              borderTopWidth="1px"
              borderBottomWidth="1px"
              borderColor="gray.200"
              py={6}
            >
              <Box
                display="grid"
                gridTemplateColumns={{ base: "1fr 1fr" }}
                gapX={6}
                gapY={4}
                fontSize="md"
              >
                <HStack>
                  <LuBookOpen color={PRIMARY} size={18} />
                  <Text fontWeight="medium">
                    {book.features?.[0]?.label || "40 Fun Pages"}
                  </Text>
                </HStack>
                <HStack>
                  <LuBaby color={PRIMARY} size={18} />
                  <Text fontWeight="medium">
                    {book.features?.[1]?.label || "Ages 4-8"}
                  </Text>
                </HStack>
                <HStack>
                  <LuPalette color={PRIMARY} size={18} />
                  <Text fontWeight="medium">
                    {book.features?.[2]?.label || "Colorful Art"}
                  </Text>
                </HStack>
                <HStack>
                  <LuGraduationCap color={PRIMARY} size={18} />
                  <Text fontWeight="medium">
                    {book.features?.[3]?.label || "Learn & Play"}
                  </Text>
                </HStack>
              </Box>
            </Box>

            <Box>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={TEXT_PRIMARY}
                mb={2}
              >
                Language
              </Text>
              <Select.Root
                collection={languageOptions}
                value={language}
                onValueChange={(item) => setLanguage(item?.value ?? language)}
                width="full"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger
                    bg="gray.50"
                    borderColor="gray.300"
                    rounded="lg"
                    py={3}
                    px={4}
                    _hover={{ borderColor: "gray.300" }}
                    _focusVisible={{
                      ring: "2px",
                      ringColor: "blue.400",
                      borderColor: "blue.400",
                    }}
                  >
                    <Select.ValueText placeholder="Select a language..." />
                    <Select.Indicator />
                  </Select.Trigger>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content
                      bg="white"
                      borderColor="gray.200"
                      rounded="md"
                      shadow="md"
                    >
                      {languageOptions.items.map((item) => (
                        <Select.Item
                          key={item.value}
                          item={item}
                          color={"black"}
                        >
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>

            <Button
              w="full"
              bg={PRIMARY}
              _hover={{ bg: "#2563EB" }}
              color="white"
              fontWeight="bold"
              fontSize="lg"
              py={3}
              px={6}
              rounded="lg"
              shadow="md"
              leftIcon={<LuGraduationCap />}
              transition="all 0.2s"
              onClick={() => router.push(`/books/${book.slug}/personalize?lang=${language}`)}
            >
              Personalise Your Book
            </Button>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}
