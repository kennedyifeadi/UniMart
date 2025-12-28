import fashion from '../assets/images/Fashion_Unimart.jpg'
import food from '../assets/images/Food_Unimart.jpg'
import electronics from '../assets/images/Electronics_Unimart.jpg'
import education from '../assets/images/Education_Unimart.jpg'
import { TrustCard } from '../components/home/TrustCard'
import type { TrustCardProps } from '../components/home/TrustCard'
import { User, Store, Building } from 'lucide-react'
import { FeaturedVendorsCard } from '../components/home/FeaturedVendorsCard'
import type { FeaturedVendorsCardProps } from '../components/home/FeaturedVendorsCard'
import { TestimonialsCard } from '../components/home/TestimonialsCard'
import type { TestimonialsCardProps } from '../components/home/TestimonialsCard'
import { Carousel } from '../components/carousel/Carousel'
import { LandingPage } from '../components/home/LandingPage'
import { Heading1 } from '../components/headings/Heading1'
import { Heading3 } from '../components/headings/Heading3'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'


type VendorDoc = {
  id: string
  category?: string
  categoryName?: string
  images?: {
    backdrop?: string
    profile?: string
  }
  businessName?: string
  businessTitle?: string
  businessDescription?: string
  description?: string
  ownerUid?: string
  isVerified?: boolean
}

const Home = () => {
  const testimonialsCardDetails: TestimonialsCardProps[] = [
    {
      name: 'Alice Johnson',
      feedback: '"I love how easy it is to connect with other students and local businesses. The interface is beautiful and user-friendly. Unimart truly understands what students need!"',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5,
      faculty: 'Faculty of Technology',
    },
    {
      name: 'Michael Smith',
      feedback: '"As a student entrepreneur, Unimart gave me the perfect platform to reach other students. My tutoring business has grown so much thanks to this amazing marketplace!"',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 4,
      faculty: 'Faculty of Science',
    },
    {
      name: 'Emily Davis',
      feedback: '"Unimart has completely changed how I shop on campus. I found the best phone repair service and even discovered amazing local food vendors. The community aspect is incredible!"',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 5,
      faculty: 'Faculty of Arts',
    },
    {
      name: 'James Wilson',
      feedback: '"The variety of services available is amazing. From food delivery to study materials, everything I need as a student is right here. Plus, supporting fellow students feels great!"',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 5,
      faculty: 'Faculty of Business',
    }
  ]
  const [featuredVendors, setFeaturedVendors] = useState<FeaturedVendorsCardProps[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadFeatured() {
      try {
        const snap = await getDocs(collection(db, 'vendors'))
        const items = snap.docs.map(d => ({ ...(d.data() as VendorDoc), id: d.id }))

        // shuffle array
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[items[i], items[j]] = [items[j], items[i]]
        }

        const picked = items.slice(0, 4).map((v: VendorDoc) => {
          const cat = (v.category || v.categoryName || 'Services').toString()
          const image = v.images?.backdrop || v.images?.profile || (cat.toLowerCase().includes('food') ? food : cat.toLowerCase().includes('fashion') ? fashion : cat.toLowerCase().includes('tech') || cat.toLowerCase().includes('technology') ? electronics : education)
          return {
            name: v.businessName || v.businessTitle || 'Vendor',
            description: v.businessDescription ?? v.description ?? '',
            link: `/vendors/${v.ownerUid ?? v.id}`,
            category: (v.category ?? '').toString().toLowerCase(),
            verified: !!v.isVerified,
            image,
          } as FeaturedVendorsCardProps
        })

        if (mounted) {
          setFeaturedVendors(picked)
          setLoadingFeatured(false)
        }
      } catch (err) {
        console.error('Failed to load featured vendors', err)
        if (mounted) setLoadingFeatured(false)
      }
    }
    loadFeatured()
    return () => { mounted = false }
  }, [])

  const trustCardDetails: TrustCardProps[] = [
    {
      name: 'UI Student',
      number: "5,000+",
      icon: <User />
    },
    {
      name: 'Student Vendors',
      number: "150+",
      icon: <Store />
    },
    {
      name: 'Faculties Served',
      number: "12",
      icon: <Building />

    }
  ]
  return (
    <div className='w-full h-max flex flex-col relative'>
      <LandingPage />
      {/* Trusted Community Section */}
      <div className='p-4 md:py-16 py-10 flex flex-col items-center bg-[#f9fafb]'>
        <Heading1>Trusted by the UI Community</Heading1>
        <Heading3>Growing stronger every day with amazing students and businesses</Heading3>
        <div className='flex flex-wrap justify-around gap-4 md:gap-0 w-[90%] mt-10'>
          {trustCardDetails.map((card, index) => (
            <TrustCard key={index} {...card} />
          ))}
        </div>
      </div>
      {/* Featured Vendors Section */}
      <div className='p-4 pt-10 md:pt-16 flex flex-col items-center bg-white'>
        <Heading1>Featured Vendors</Heading1>
        <Heading3>Discover amazing businesses run by your fellow students</Heading3>
        {/* Mobile Carousel View */}
        <div className='md:hidden w-[90%] mt-16'>
          {loadingFeatured ? (
            <Carousel autoPlayInterval={0}>
              {[1, 2, 3].map((i) => (
                <div key={i} className='w-full h-48 bg-gray-100 rounded-lg p-4 flex-shrink-0 flex items-center justify-center'>
                  <div className='animate-pulse w-full h-full flex items-center justify-center'>
                    <div className='w-3/4 h-3/4 bg-gray-200 rounded' />
                  </div>
                </div>
              ))}
            </Carousel>
          ) : (
            <Carousel autoPlayInterval={0}>
              {featuredVendors.map((vendor, index) => (
                <FeaturedVendorsCard key={index} {...vendor} />
              ))}
            </Carousel>
          )}
        </div>
        {/* Desktop Grid View */}
        <div className='hidden md:flex flex-wrap justify-around w-[90%] mt-16'>
          {loadingFeatured ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='w-[23%] h-56 bg-gray-100 rounded-lg p-4 m-2'>
                <div className='animate-pulse h-full w-full flex flex-col gap-3'>
                  <div className='bg-gray-200 h-32 rounded' />
                  <div className='bg-gray-200 h-4 rounded w-3/4' />
                  <div className='bg-gray-200 h-4 rounded w-1/2' />
                </div>
              </div>
            ))
          ) : (
            featuredVendors.map((vendor, index) => (
              <FeaturedVendorsCard key={index} {...vendor} />
            ))
          )}
        </div>
      </div>
      <div className='p-4 py-10 md:py-16 flex flex-col items-center bg-[#f9fafb]'>
        <Heading1>What Students Say</Heading1>
        <Heading3>Real experiences from our amazing UI community</Heading3>
        <div className='flex justify-center items-center w-[90%] mt-20'>
          <Carousel autoPlayInterval={3000}>
            {testimonialsCardDetails.map((testimonial, index) => (
              <TestimonialsCard key={index} {...testimonial} />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  )
}


export default Home
