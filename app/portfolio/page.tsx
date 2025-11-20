import PortfolioDisplay from "@/src/components/portfolio/portfolio";
import { Suspense } from 'react';


export default function Portfolio() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <PortfolioDisplay/>
    </Suspense>
  );
}
