import { Landing } from "../components/about/Landing"
import { Story, type StoryProps } from "../components/about/Story"
import { Heading1 } from "../components/headings/Heading1"
import { Heading3 } from "../components/headings/Heading3"
import studentImage from "../assets/images/UI-students.jpg"
import { GoalCard, type GoalCardProps } from "../components/about/GoalCard"
import { ShieldCheck, Smartphone, Users, ShoppingBag } from 'lucide-react'
import { TeamCard } from "../components/about/TeamCard"
import maleProfile from "../assets/images/MaleProfile.jpg"
import FemaleProfile from "../assets/images/FemaleProfile.jpg"
import { StudentCard } from "../components/about/StudentCard"
import { Button } from "../components/buttonb/Button"
import kennedy from "../assets/images/SARE-EXCO4.jpg"





const About = () => {
  const ourStoryPoints: StoryProps[] = [
    {
      title: 'The Problem We Saw',
      description: "UI students with amazing businesses and services struggled with visibility and limited reach. Many talented entrepreneurs couldn't connect with their fellow students who needed their products and services."
    },
    {
      title: 'Our Vision',
      description: "We envisioned a centralized marketplace where UI students could easily discover, connect, and support each other. A platform that brings the entire campus community together in one digital space."
    },
    {
      title: 'Our Mission',
      description: "To boost student entrepreneurship by providing a trusted platform that connects student businesses with their peers, fostering economic growth and community support within the UI ecosystem."
    }
  ]
  const goals: GoalCardProps[] = [
      {
      title: 'Easy Discovery',
      description: 'Help students easily discover businesses and services from their fellow UI students with intuitive search and categories.',
      icon: <ShoppingBag size={30} />
    },
    {
      title: 'Community Support',
      description: 'Boost entrepreneurship and community support by connecting student businesses with their target audience.',
      icon: <Users size={30} />
    },
    {
      title: 'Trusted Connections',
      description: 'Provide safe and trusted vendor connections through our UI verification system and community reviews.',
      icon: <ShieldCheck size={30} />
    },
    {
      title: 'Mobile-First Experience',
      description: 'Offer a simple, mobile-first experience that works seamlessly across all devices for busy students.',
      icon: <Smartphone size={30} />
    }
  ]
  const teamMembers = [
    {
      name: 'Morayo',
      role: 'Founder & CEO',
      bio: 'Passionate about student entrepreneurship',
      image: FemaleProfile,
      linkedin: '',
      instagram: ''
    },
    {
      name: 'Abuka Victor',
      role: 'CTO',
      bio: 'Building technology for students',
      image: maleProfile,
      linkedin: '',
      instagram: ''
    },
    {
      name: 'Kennedy Ifeadi',
      role: 'Head of Engineering',
      bio: 'Creating beautiful user experiences',
      image: kennedy,
      linkedin: '',
      instagram: ''
    },
    {
      name: 'Suzanne',
      role: 'Head of Design',
      bio: 'Connecting students across UI',
      image: FemaleProfile,
      linkedin: '',
      instagram: ''
    }

  ]
  const studentVoices = [
    {
      name: 'Jane Doe',
      testimonial: 'Unimart gave me the confidence to start my online tutoring business. The platform makes it so easy to connect with students who need help with their studies!',
      image: maleProfile,
      rating: 5,
      faculty: 'Faculty of Engineering'
    },
    {
      name: 'John Smith',
      testimonial: 'Between classes and clinical rotations, Unimart helps me find quick food options and study materials from fellow students. It saves me so much time!',
      image: FemaleProfile,
      rating: 4,
      faculty: 'Faculty of Law'
    },
    {
      name: 'Abuka Victor',
      testimonial: 'As a graphic design student, I found so many clients through Unimart. The verification system makes everyone feel safe to do business with each other.',
      image: maleProfile,
      rating: 5,
      faculty: 'Faculty of Business'
    },
    {
      name: 'Linda Nguyen',
      testimonial: 'The community aspect of Unimart is incredible. It feels like we are all supporting each other to succeed. This is what university life should be about!',
      image: FemaleProfile,
      rating: 5,
      faculty: 'Faculty of Arts'
    }
  ]
  const stats = [
    {
      label: 'Active Students',
      value: '15,000+'
    },
    {
      label: 'Faculties Served',
      value: '12'
    },
    {
      label: 'Student Vendors',
      value: '150+'
    }
  ]
  return (
    <div className="flex flex-col w-full h-max relative">
      {/* About landing section */}
      <Landing />
      {/* Our story section */}
      <div className="flex flex-col md:px-36 px-6 py-10 md:flex-row gap-6 mb-10">
        <div className="flex-1 flex gap-6 flex-col">
          <Heading1 className="text-start">Our Story</Heading1>
          {
            ourStoryPoints.map((point, index) => (
              <Story {...point} key={index} />
            ))
          }
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="w-full h-max relative overflow-hidden group shadow-lg rounded-xl cursor-pointer">
            <div className="absolute inset-0 rounded-xl z-10 bg-black/65 h-full w-full flex justify-center items-center group-hover:scale-105"></div>
            <img src={studentImage} alt="UI Students" className="w-full overflow-hidden group-hover:scale-105 h-auto rounded-xl shadow-xl transition-transform duration-300" />
          </div>
        </div>
      </div>
      {/* Our goals section */}
      <div className="flex flex-col mb-10 gap-10 ">
        <div className="flex flex-col px-2">
          <Heading1>Our Goals</Heading1>
          <Heading3>We're committed to building a platform that truly serves the UI student community</Heading3>
        </div>
        <div className="flex justify-center gap-8 flex-wrap">
          {
            goals.map((goal, index) => (
              <GoalCard {...goal} key={index} />
            ))
          }
        </div>
      </div>
      {/* Meet the team section */}
      <div className="flex flex-col mb-10 gap-10">
        <div className="flex flex-col">
          <Heading1>Meet the Team</Heading1>
          <Heading3>The passionate UI alumni and students building the future of campus commerce</Heading3>
        </div>
        <div className="flex justify-center gap-8 flex-wrap">
          {
            teamMembers.map((member, index) => (
              <TeamCard {...member} key={index} />
            ))
          }
        </div>
      </div>
      {/* Student voices section */}
      <div className="flex flex-col mb-10 gap-10">
        <div className="flex flex-col">
          <Heading1>Student Voices</Heading1>
          <Heading3>Hear from UI students who are part of the Unimart community</Heading3>
        </div>
        <div className="flex justify-center gap-8 flex-wrap">
          {
            studentVoices.map((voice, index) => (
              <StudentCard {...voice} key={index} />
            ))
          }
        </div>
      </div>
      {/* Join the movement section */}
      <div className="w-full h-max py-14 flex flex-col items-center bg-[#2563eb]">
        <Heading1 className="text-center text-white">Join the Movement</Heading1>
        <span className="text-center font-medium md:text-2xl text-[#ffffffe2]">Discover and Support Student Businesses Today!</span>
        <span className="text-center text-sm w-[90%] md:w-[40%] mt-10 text-[#ffffffb5]">Be part of a thriving community where UI students connect, collaborate, and grow together. Your next favorite service or product is just a click away.</span>
        <div className="flex gap-4 md:flex-row flex-col mt-14 w-[90%] md:w-auto">
          <Button classname="bg-white hover:!bg-[#fffffff1] !text-[#2563eb]">Explore Vendors</Button>
          <Button classname="border border-white hover:bg-white hover:!text-[#2563eb]">Start Selling</Button>
        </div>
        <div className="mt-14 flex flex-col md:flex-row md:gap-20 justify-evenly gap-8 w-full">
          {
            stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-white font-bold text-4xl">{stat.value}</span>
                <span className="text-[#ffffffe9] text-sm">{stat.label}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default About
