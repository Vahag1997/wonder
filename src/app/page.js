
import BookShowcase from './componets/BookShowcase';
import FaqSection from './componets/FaqSection';
import AdoredSection from './componets/AdoredSection';
import AgeBrowseSection from './componets/AgeBrowseSection';
import PersonalizedBooksBanner from './componets/PersonalizedBooksBanner';
import InspireDreamsSection from './componets/InspireDreamsSection';
import BottomBanner from './componets/BottomBanner';
import { books } from './constants';
import { Flex } from '@chakra-ui/react';

export default async function Home() {
  return (
    <>
      <Flex flexDir="column" gap={6}>
        <PersonalizedBooksBanner/>
        <BookShowcase data={books} />
        <AdoredSection />
        <BookShowcase data={books} />
        <FaqSection />
        <BookShowcase data={books} /> 
        <InspireDreamsSection/>
        <AgeBrowseSection/>
      </Flex>
      
      {/* Bottom Banner - Right above footer */}
      <BottomBanner />
    </>
  );
}
