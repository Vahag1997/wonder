"use client";

import { useRef, useState } from "react";
import {
  Box,
  Grid,
  Heading,
  Text,
  Image,
  Button,
  Field,
  Input,
  Select,
  Portal,
  createListCollection,
  HStack,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { LuUpload, LuCheck, LuX, LuLightbulb, LuCamera } from "react-icons/lu";
import PersonalisedShowcase from "./PersonalisedShowcase";

const languageOptions = createListCollection({
  items: [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
  ],
});

export default function PersonalizeStart() {
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState("en");
  const [photo, setPhoto] = useState("");
  const fileRef = useRef(null);

  const correct = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCfddFzRNB14tGQU1MTLQNod4c63PHg8DyzL30F_uhnSPxr6tgeSlcPzcvAeo_txoeYGqhZw1oKJdwAF36Fa8A-pbz_YipaYOSF4KYMCZ5yAHV7o07rUMB9WrKk29fUWHhDUCasArwgUi-QljvCNP4F4abH6Vo3-UoedlI_uIenA3lwshP7L8JGUG9DoidootncUhvgqghBlEo4nUU9Mg0QKaNt63ybGdDKqmmmiY9Dl3xVtIHWgd4YxUdQtgLCnygDxKhTKq4x",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAXdbcEMsqkJe1OfKe6DURntUsJUc2tAGLgUBjbZFI2psKmS1f4jb3sG8Guj7QpkHFJbT6K-wf1SSfhFkf8_p4zVP9I97aru4ZPonuipptTbA0s5_ijgc7g1mjwdlAH5-A__gWIcpm01X97mZpmHTjQndws8c56qo5vdF3ATIq03XYlUq8tgfBXW-VTPuhS_N2Y8Oj03ggz92HoE9eVZ9OfrZlDcIOGJ0KuyPLSY_7o3ztVubUvmhKIsLNmPMMHMsLgiRYvScN8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBHTmM3yMy3wYv4sgDftYaS60P3YOzZuMxZj0vsiwt5J-Xbh6GubFU3yezxdZ3yqx0ezUsBcw03twP-ogGEolGZLPyicHp4LxSiJA7nUYOaawuBoExNhcoZtuKJidgCJLIXupbtZ9ZfQA5cZ1rc8LFuTCMk8Qk__fHrCfr6Pa5ohknzoWXobFjisaCkV6NuUv30_NtbmZ5znavjXtWRNpzJY-bUzddUdWNV1NYu4NhOPwqOKrq9FASEi4t0TrnXPFAc2DCqfWfL",
  ];
  const incorrect = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBfd0FM_nDDObbCbcCoJDCc8y-_KibxwB9xlkPxc0kRBTqXnEbwMlezs7S7F_99t9IcAKLUxaWK5iMyY5ryboRNf2iwEVNrgNAQI_vzNaZrT4htE04DPYUgSkOBFrxu_jwhsSAYCC_prf103vhevNfZsxN3udqgqMfAFdvEKtdg8dczpWbDJ_7PA9PMlyVcMIYYFpbtdekU14rcmJLcrz-shLjsqO2cAEPVGXeq9tci_yw1JicjDQQKQF4hOkn5zE-r6xJJOdzw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD7-kPSRYP7nt0wFjMsdNo87fNlnsrhurbsnj17wUWUPVXN1UQUkQa9vb-glBU8lSpJn8hQugK4pw6EvP6QXeFWpL-N1_YnLT7H_Hkr-_lwMlxSdRyVHKioG9QbgZdYw-H3tZlMudoBS2vnFTQVLgBKzU3q8Lm1kmzH_AOXWAbp9banT9iXdp6e5sPjaQ3p6i5msjZjFsjyZsmruIlpIZWawUWLTS7cywTuDe2zw_urYKBMaeSYH0XmysqTsALFU-f6b3GRg8N5",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA9mLzun3kEYeKvk7EZBU9h9XnS-xc97twTACCtDFcu6zBPL6M3SSrzWkhRbWye9T7gJyXwo9uPvwtOzMi2H9PuYpyfEyG4aJtQE8_361NkHha4CMUIHYi45nDo-YrYmT2YVi5JEJAP5juaWpMVSxl7AX-hHICQ9sDW861NPXEhf_gG2Ftxya4k7Un2xOcyeiAwEulntH9SGEIJIHaTLkNODiVO7WeLSKid_nI73h4DdmKbTdyW6zyEpAH6PismmTrep56eB3P0",
  ];

  const onChooseFile = () => fileRef.current?.click();
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  return (
    <Box
      bg="#f5f5f4"
      /* stone-50 */ minH="100dvh"
      px={{ base: 4, md: 6 }}
      py={{ base: 8, md: 12 }}
    >
      <Box maxW="7xl" mx="auto">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12}>
          {/* LEFT: form card */}
          <Box bg="white" rounded="2xl" shadow="lg" p={{ base: 6, md: 8 }}>
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              color="gray.800"
              mb={2}
              sx={{ fontFamily: '"Playfair Display", serif' }}
            >
              Create your own story
            </Heading>
            <Text color="gray.500" mb={8}>
              Personalize your book to make it truly unique.
            </Text>

            <VStack spacing={6} align="stretch">
              {/* First name */}
              <Field.Root>
                <Field.Label fontSize="sm" color="gray.700" mb={2}>
                  Child&apos;s first name
                </Field.Label>
                <Input
                  placeholder="e.g. Olivia"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  bg="#fafaf9" /* stone-50 */
                  borderColor="#e7e5e4" /* stone-200 */
                  rounded="lg"
                  shadow="sm"
                  py={3}
                  px={4}
                  fontSize="sm"
                  _focusVisible={{
                    ring: "2px",
                    ringColor: "#993cee",
                    borderColor: "#993cee",
                  }}
                />
              </Field.Root>

              {/* Age & Language */}
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                <Field.Root>
                  <Field.Label fontSize="sm" color="gray.700" mb={2}>
                    Child&apos;s age
                  </Field.Label>
                  <Input
                    type="text"
                    placeholder="e.g. 5"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    bg="#fafaf9"
                    borderColor="#e7e5e4"
                    rounded="lg"
                    shadow="sm"
                    py={3}
                    px={4}
                    fontSize="sm"
                    _focusVisible={{
                      ring: "2px",
                      ringColor: "#993cee",
                      borderColor: "#993cee",
                    }}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontSize="sm" color="gray.700" mb={2}>
                    Language
                  </Field.Label>
                  <Select.Root
                    collection={languageOptions}
                    value={language}
                    onValueChange={(v) => setLanguage(v?.value ?? language)}
                    width="full"
                  >
                    <Select.HiddenSelect />

                    <Select.Control>
                      <Select.Trigger
                        bg="white"
                        borderColor="gray.200"
                        rounded="lg"
                        shadow="sm"
                        py={2}
                        px={3}
                        fontSize="sm"
                        color="gray.900" // Added text color
                        _focusVisible={{
                          ring: "2px",
                          ringColor: "blue.500",
                          borderColor: "blue.500",
                        }}
                      >
                        <Select.ValueText placeholder="Select language" />
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
                          overflow="hidden"
                        >
                          {languageOptions.items.map((item) => (
                            <Select.Item
                              key={item.value}
                              item={item}
                              px={3}
                              py={2}
                              rounded="md"
                              cursor="pointer"
                              color="gray.900" // Base text color
                              _hover={{ bg: "gray.100", color: "gray.900" }}
                              sx={{
                                "&[data-highlighted]": {
                                  backgroundColor: "gray.100",
                                  color: "gray.900",
                                },
                                "&[data-state=checked]": {
                                  backgroundColor: "blue.500",
                                  color: "white",
                                  fontWeight: "medium",
                                },
                              }}
                            >
                              {item.label}
                              <Select.ItemIndicator ml="auto" color="inherit" />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Field.Root>
              </Grid>

              {/* Upload */}
              <Box>
                <Heading as="h3" fontSize="sm" color="gray.700" mb={2}>
                  Upload a photo of your child
                </Heading>

                <HStack spacing={4} align="center">
                  <Box className="shrink-0">
                    <Flex
                      w="64px"
                      h="64px"
                      rounded="full"
                      bg="#f5f5f4"
                      align="center"
                      justify="center"
                    >
                      {photo ? (
                        <Image
                          src={photo}
                          alt="Preview"
                          w="64px"
                          h="64px"
                          rounded="full"
                          objectFit="cover"
                        />
                      ) : (
                        <LuCamera size={28} color="#a8a29e" />
                      )}
                    </Flex>
                  </Box>

                  <VStack align="start" spacing={1}>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={onFileChange}
                    />
                    <Button
                      onClick={() => fileRef.current?.click()}
                      bg="#993cee"
                      color="white"
                      fontWeight="semibold"
                      size="sm"
                      px={5}
                      py={2}
                      rounded="lg"
                      leftIcon={<LuUpload size={16} />}
                      _hover={{ bg: "#b577efff" }}
                    >
                      Choose Image
                    </Button>
                    <Text fontSize="xs" color="gray.500">
                      PNG, JPG, GIF up to 10MB
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Photo tips */}
              <Box bg="#fafaf9" border="1px solid #e7e5e4" rounded="lg" p={4}>
                <HStack spacing={1.5} mb={3}>
                  <LuLightbulb size={16} color="#57534e" />
                  <Text fontSize="xs" fontWeight="semibold" color="gray.600">
                    PHOTO TIPS
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.500" mb={4}>
                  For best results, use a clear, front-facing photo.
                </Text>

                <Grid templateColumns="repeat(6, 1fr)" gap={2}>
                  {[
                    ...correct.map((src) => ({ src, ok: true })),
                    ...incorrect.map((src) => ({ src, ok: false })),
                  ].map(({ src, ok }, i) => (
                    <Box key={i} role="group" position="relative">
                      <Image
                        src={src}
                        alt={`${ok ? "Correct" : "Incorrect"} example ${i + 1}`}
                        rounded="full"
                        borderWidth="2px"
                        borderColor={ok ? "green.400" : "red.400"}
                      />
                      <Flex
                        position="absolute"
                        inset="0"
                        rounded="full"
                        align="center"
                        justify="center"
                        bg={ok ? "green.500" : "red.500"}
                        opacity={0}
                        transition="opacity 0.2s"
                        _groupHover={{ opacity: 0.7 }}
                      >
                        {ok ? <LuCheck color="#fff" /> : <LuX color="#fff" />}
                      </Flex>
                    </Box>
                  ))}
                </Grid>
              </Box>

              {/* CTA */}
              <Button
                w="full"
                bg="#993cee"
                color="white"
                fontWeight="bold"
                py={4}
                px={6}
                rounded="lg"
                _hover={{ bg: "#b577efff" }}
                fontSize="md"
                boxShadow="0 10px 24px rgba(239, 170, 235, 0.3)"
              >
                Preview Your Book
              </Button>
            </VStack>
          </Box>
          <PersonalisedShowcase />
        </Grid>
      </Box>
    </Box>
  );
}
