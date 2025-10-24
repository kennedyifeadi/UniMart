import { Heading1 } from "../components/headings/Heading1"
import { Heading3 } from "../components/headings/Heading3"

const About = () => {
  return (
    <div className="flex flex-col w-full h-max relative">
      {/* About landing section */}
      <div></div>
      {/* Our story section */}
      <div></div>
      {/* Our goals section */}
      <div>
        <Heading1>Our Goals</Heading1>
        <Heading3>We're committed to building a platform that truly serves the UI student community</Heading3>
      </div>
      {/* Meet the team section */}
      <div>
        <Heading1>Meet the Team</Heading1>
        <Heading3>The passionate UI alumni and students building the future of campus commerce</Heading3>
      </div>
      {/* Student voices section */}
      <div>
        <Heading1>Student Voices</Heading1>
        <Heading3>Hear from UI students who are part of the Unimart community</Heading3>
      </div>
      {/* Join the movement section */}
      <div></div>
    </div>
  )
}

export default About
