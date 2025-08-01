import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Collapsible,
} from "@chakra-ui/react";
import { IoIosArrowDown } from "react-icons/io";

export default async function FaqSection() {
  const faqs = [
    {
      question: "Why Choose us?",
      answer:
        "We are a combination of my name 'NAREK' and the word 'PARFUM'. It reflects that each scent we offer is a result of my personal inspiration and a part of me. I wanted to create a unique name that’s easy to remember. NARFFUM sounds original and authentic and most importantly, it carries both my identity and the essence of the perfume world. NARFFUM is my signature in the world of fragrances. For me, perfume is not just a scent—it's emotion and memory, something I want to pass on to every buyer. NARFFUM represents the harmony of personal touch and high quality.",
    },
    {
      question:
        "Why are your prices much more affordable than in other stores?",
      answer:
        "We intentionally chose an accessible pricing policy because long-term customer relationships matter most to us. We value our customers and especially appreciate when they recommend us to friends. Affordable prices are also possible because we avoid extra costs—no rent for physical stores or staff—since we operate online.",
    },
    {
      question: "Why choose us?",
      answer:
        "1. Personalized Approach. We are always ready to provide our clients with personalized consultations, taking into account their preferences and individual needs. 2. 100% Authentic Products. We guarantee that all products presented by us are original and sourced only from official suppliers. 3. Competitive Prices. We work with the largest and most trusted suppliers, allowing us to offer a wide range of products at competitive prices. 4. Fast Delivery. We ensure prompt delivery so our customers can enjoy their purchases as soon as possible. 5. Wide Selection. With us, you’ll find both world-renowned brands and niche fragrances that are hard to find in other stores.",
    },
    {
      question: "How is the delivery carried out?",
      answer: "",
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
          Frequently Asked Questions
        </Text>
      </VStack>
      <VStack spacing="6" align="stretch" width="85%" mt="40px">
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
                    lineHeight={{ base: "22px", md: "43px" }}
                    fontSize={{ base: "16px", md: "22px" }}
                    fontWeight={400}
                  >
                    {faq.question}
                  </Text>
                  <IoIosArrowDown
                    style={{
                      width: "unset",
                      height: "unset",
                      fontSize: "1.5rem",
                      color: "black",
                    }}
                  />
                </HStack>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Box
                  padding="4"
                  color="gray.600"
                  fontSize={"md"}
                  textAlign="left"
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
