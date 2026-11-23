import Categories from "./Categories";
import FeaturedProducts from "./FeaturedProducts";
import HealthProducts from "./HealthProducts";
import Hero from "./Hero";
import MobileSearch from "./MobileSearch";
import Newsletter from "./Newsletter";
import PromoBanner from "./PromoBanner";
import Reviews from "./Reviews";
import ShowroomBanner from "./ShowroomBanner";
import WhyChooseUs from "./WhyChooseUs";

export default function HomeAll() {
    return (
        <>
            {/* Full-width hero — stays outside container (background image) */}
            <Hero />

            {/* All other sections inside a centered max-width container */}
            <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                <Categories />
                <MobileSearch />
                <FeaturedProducts />
                <PromoBanner />
                <WhyChooseUs />
                <ShowroomBanner />
                <HealthProducts />
                <Reviews />
                <Newsletter />
            </div>
        </>
    );
}
