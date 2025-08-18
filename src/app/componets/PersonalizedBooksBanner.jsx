'use client';

import { Box, Flex, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

export default function PersonalizedBooksBanner() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      w="full"
      overflow="hidden"
      px={{ base: 4, md: 10 }}
      py={{ base: 10, md: 16 }}
             bg="#1e3c92"
       backgroundImage="url('https://resources.wonderwraps.com/81383ef1-2e98-4378-abb6-9af46dfb0190/img/home/blue-gradient.svg')"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      position="relative"
    >
      <MotionFlex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        gap={10}
        zIndex={1}
      >
        {/* 🎥 Left Side - Styled Video */}
        <MotionBox
          flex="1"
          borderRadius="2xl"
          overflow="hidden"
          shadow="xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Box
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            border="4px solid white"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source
                src="https://resources.wonderwraps.com/81383ef1-2e98-4378-abb6-9af46dfb0190/video/video-preview.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Gradient Overlay on Video */}
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-t, #00000040, transparent)"
              zIndex={1}
            />
          </Box>
        </MotionBox>

        {/* ✨ Right Side - Text Content */}
        <Box flex="1" textAlign={{ base: 'center', md: 'left' }}>
                     <Text
             fontSize="sm"
             textTransform="uppercase"
             letterSpacing="wider"
             color="#00BFFF"
             fontWeight="bold"
             mb={3}
             textShadow="0 2px 4px rgba(0,0,0,0.8)"
           >
             {t("banners.bringStorybookToLife")}
           </Text>

           <Heading
             fontSize={{ base: '2xl', md: '4xl' }}
             fontWeight="extrabold"
             color="white"
             lineHeight="1.2"
             mb={6}
             textShadow="0 4px 8px rgba(0,0,0,0.9)"
           >
             {t("banners.craftMagicalTales")}
           </Heading>

          <Button
            size="lg"
            leftIcon={<Icon as={FaBookOpen} />}
            bg="white"
            color="#00BFFF"
            fontWeight="bold"
            borderRadius="full"
            px={6}
            py={6}
            boxShadow="lg"
            _hover={{ bg: 'gray.50', transform: 'translateY(-2px)' }}
            transition="all 0.3s ease"
            onClick={() => router.push('/books')}
          >
            {t("banners.viewAllBooks")}
          </Button>
        </Box>
      </MotionFlex>
    </MotionBox>
  );
}
