'use client';

import { Box, Flex, Text, Image, VStack, HStack, Grid, GridItem } from '@chakra-ui/react';

export default function CustomizationSection() {
  return (
    <Box as="section" h="auto" w="full" color="white">
      {/* Top diamond pattern */}
      <Box h="0" w="full" display="flex" alignItems="center" mt={8}>
        <Box 
          h="56px" 
          position="relative" 
          top="0.05rem" 
          display="flex" 
          w="full"
          backgroundImage="url('https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/pink-diamond.svg')"
          backgroundRepeat="repeat-x"
        />
      </Box>

      {/* Main content */}
      <Flex 
        direction="column" 
        gap={{ base: 1, md: 2 }} 
        w="full" 
        h="full" 
        p={{ base: 2, md: "10px" }}
        background="linear-gradient(129.35deg, #FF698C 27.47%, #A00B2E 182.17%)"
      >
        {/* Header text */}
        <VStack spacing={{ base: 3, md: 0 }} mb={2} textAlign="center">
          <Text 
            fontSize={{ base: "xs", md: "sm" }} 
            fontWeight="extrabold" 
            fontFamily="sans" 
            letterSpacing="3px" 
            lineHeight={{ base: "normal", md: 7 }} 
            textTransform="uppercase"
          >
            Customize Faces, Expressions, and Angles
          </Text>
          <Text 
            fontSize={{ base: "26px", md: "30px" }} 
            lineHeight={{ base: 2, md: "20px" }} 
            fontFamily="marcellus"
          >
            To bring your character to life!
          </Text>
        </VStack>

        {/* Grid with three columns */}
        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} 
          gap={2}
        >
          {/* Column 1 - Many Styles */}
          <GridItem>
            <VStack align="center">
              <Flex>
                <Image 
                  src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_1_1.png" 
                  alt="" 
                  aspectRatio="1" 
                  borderRadius="full" 
                  w="130px" 
                  h="130px" 
                  position="relative"
                />
                <Image 
                  src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_1_2.png" 
                  alt="" 
                  aspectRatio="1" 
                  borderRadius="full" 
                  w="110px" 
                  h="110px" 
                  position="relative" 
                  top={{ base: 8, md: 7 }}
                />
              </Flex>
              <Flex justify="center">
                <Flex>
                  <Box h="fit" display="flex" justify="end">
                    <Image 
                      src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow1.svg" 
                      alt="" 
                      w={{ base: 14, md: 24 }} 
                      h={{ base: 14, md: 24 }} 
                      position="relative" 
                      right={{ base: 4, md: 6 }}
                    />
                  </Box>
                  <Image 
                    src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_1_3.png" 
                    alt="" 
                    aspectRatio="1" 
                    borderRadius="full" 
                    w="100px" 
                    position="relative" 
                    bottom={6} 
                    right={{ base: 6, md: 8 }}
                  />
                </Flex>
              </Flex>
              <Text 
                fontFamily="mynerve" 
                fontSize={{ base: "22px", md: "28px" }} 
                lineHeight={7} 
                position="relative" 
                right={14} 
                bottom={{ base: 6, md: 0 }} 
                top={{ base: 0, md: 2 }}
              >
                Many Styles
              </Text>
            </VStack>
          </GridItem>

          {/* Column 2 - Full of Expressions */}
          <GridItem>
            <VStack pt={{ base: 6, md: 0 }}>
              <Text 
                fontFamily="mynerve" 
                fontSize={{ base: "22px", md: "28px" }} 
                position="relative" 
                bottom={{ base: 10, md: 8 }} 
                left={24} 
                lineHeight={7} 
                w="fit"
              >
                Full of Expressions
              </Text>
              <Box h="0" w="full">
                <Image 
                  src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow2.svg" 
                  alt="" 
                  w={{ base: 14, md: 24 }} 
                  h={{ base: 14, md: 24 }} 
                  position="relative" 
                  bottom={10} 
                  left={36}
                />
              </Box>
              <Flex justify="center" pt={{ base: 0, md: 6 }}>
                <Image 
                  src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_2_1.png" 
                  alt="" 
                  aspectRatio="1" 
                  borderRadius="full" 
                  w="105px" 
                  h="105px" 
                  position="relative"
                />
                <Image 
                  src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_2_2.png" 
                  alt="" 
                  aspectRatio="1" 
                  borderRadius="full" 
                  w="110px" 
                  h="110px" 
                  position="relative" 
                  top={8}
                />
              </Flex>
              <Flex justify="center">
                <Image 
                  src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_2_3.png" 
                  alt="" 
                  aspectRatio="1" 
                  borderRadius="full" 
                  maxW="140px" 
                  position="relative" 
                  right={9} 
                  bottom={2}
                />
              </Flex>
            </VStack>
          </GridItem>

          {/* Column 3 - Different Angels */}
          <GridItem>
            <VStack align="center">
              <Flex>
                <Box>
                  <Image 
                    src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_3_1.png" 
                    alt="" 
                    aspectRatio="1" 
                    borderRadius="full" 
                    maxW="110px" 
                    position="relative"
                  />
                  <Image 
                    src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_3_3.png" 
                    alt="" 
                    aspectRatio="1" 
                    borderRadius="full" 
                    maxW="105px" 
                    position="relative"
                  />
                </Box>
                <Flex align="center">
                  <Image 
                    src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/children/child_3_2.png" 
                    alt="" 
                    aspectRatio="1" 
                    borderRadius="full" 
                    maxW="150px" 
                    position="relative"
                  />
                </Flex>
              </Flex>
              <Box h="0">
                <Image 
                  src="https://resources.wonderwraps.com/bc7821b1-0762-47ee-b391-77fb76a7811c/img/home/arrow3.svg" 
                  alt="" 
                  w={{ base: 14, md: 24 }} 
                  h={{ base: 14, md: 24 }} 
                  position="relative" 
                  bottom={10} 
                  left={{ base: 8, md: 8 }}
                />
              </Box>
              <Text 
                fontFamily="mynerve" 
                fontSize={{ base: "22px", md: "28px" }} 
                lineHeight={7} 
                position="relative" 
                top={{ base: 3, md: 14 }} 
                left={{ base: 10, md: 0 }}
              >
                Different Angels
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
}
