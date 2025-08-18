'use client';

import BookShowcase from './componets/BookShowcase';
import FaqSection from './componets/FaqSection';
import AdoredSection from './componets/AdoredSection';
import AgeBrowseSection from './componets/AgeBrowseSection';
import PersonalizedBooksBanner from './componets/PersonalizedBooksBanner';
import InspireDreamsSection from './componets/InspireDreamsSection';
import BottomBanner from './componets/BottomBanner';
import { bestSellers, girlsBooks, boysBooks } from './constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Flex } from '@chakra-ui/react';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <>
      <Flex flexDir="column" gap={6}>
        <PersonalizedBooksBanner/>
        
        {/* Best Sellers Section */}
        <BookShowcase 
          title={t("books.bestSellers")}
          subtitle={t("books.popular")}
          data={bestSellers} 
        />
        
        <AdoredSection />
        
        {/* Books for Girls Section */}
        <BookShowcase 
          title={t("books.booksForGirls")}
          subtitle={t("books.forGirls")}
          data={girlsBooks} 
        />
        
        <FaqSection />
        
        {/* Books for Boys Section */}
        <BookShowcase 
          title={t("books.booksForBoys")}
          subtitle={t("books.forBoys")}
          data={boysBooks} 
        />
        
        <InspireDreamsSection/>
        <AgeBrowseSection/>
      </Flex>
      
      {/* Bottom Banner - Right above footer */}
      <BottomBanner />
    </>
  );
}
