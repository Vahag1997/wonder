'use client';

import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Collapsible,
} from "@chakra-ui/react";
import { IoIosArrowDown } from "react-icons/io";
import { useLanguage } from '../../contexts/LanguageContext';

export default function FaqSection() {
  const { t } = useLanguage();
  
  const faqs = [
    {
      question: t("faq.question1"),
      answer: t("faq.answer1"),
    },
    {
      question: t("faq.question2"),
      answer: t("faq.answer2"),
    },
    {
      question: t("faq.question3"),
      answer: t("faq.answer3"),
    },
    {
      question: t("faq.question4"),
      answer: t("faq.answer4"),
    },
    {
      question: t("faq.question5"),
      answer: t("faq.answer5"),
    },
    {
      question: t("faq.question6"),
      answer: t("faq.answer6"),
    },
    {
      question: t("faq.question7"),
      answer: t("faq.answer7"),
    },
    {
      question: t("faq.question8"),
      answer: t("faq.answer8"),
    },
    {
      question: t("faq.question9"),
      answer: t("faq.answer9"),
    },
    {
      question: t("faq.question10"),
      answer: t("faq.answer10"),
    },
    {
      question: t("faq.question11"),
      answer: t("faq.answer11"),
    },
  ];
  
  return (
    <Flex
      mx="auto"
      mt={{ base: "6", md: "10" }}
      px={{ base: 4, md: 16 }}
      mb={{ base: "30px", md: "120px" }}
      flexDir="column"
      justify="center"
      align="center"
      width="100%"
    >
      <VStack spacing={3} mb={10} textAlign="center">
        <Text
         fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          lineHeight="shorter"
          color="gray.700"
        >
          {t("faq.title")}
        </Text>
      </VStack>
      <VStack spacing="6" align="stretch" width={{ base: "95%", md: "85%" }} mt="40px">
        {faqs.map((faq, index) => (
          <Box
            key={index}
            borderBottom="1px solid"
            borderColor="gray.300"
            pb="4"
            width="100%"
          >
            <Collapsible.Root>
              <Collapsible.Trigger paddingY="3" width="100%">
                <HStack justify="space-between" align="center" width="100%">
                  <Text
                    color="black"
                    flex="1"
                    textAlign="left"
                    lineHeight={{ base: "28px", md: "43px" }}
                    fontSize={{ base: "18px", md: "22px" }}
                    fontWeight={500}
                  >
                    {faq.question}
                  </Text>
                  <IoIosArrowDown
                    style={{
                      width: "unset",
                      height: "unset",
                      fontSize: "1.8rem",
                      color: "black",
                    }}
                  />
                </HStack>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Box
                  padding="4"
                  color="gray.600"
                  fontSize={{ base: "16px", md: "md" }}
                  textAlign="left"
                  lineHeight={{ base: "24px", md: "normal" }}
                >
                  {faq.answer}
                </Box>
              </Collapsible.Content>
            </Collapsible.Root>
          </Box>
        ))}
      </VStack>
    </Flex>
  );
}
