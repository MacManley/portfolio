export default function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <div className="profile-section">
          <div className="profile-image">
            <img src="./assets/nathan.jpeg" alt="Nathan Manley" />
          </div>
          <div className="profile-info">
            <h1>Nathan Manley</h1>
            <h2>Engineering @ UCC • Passionate Innovator</h2>
            <p className="intro-text">Strong foundation in electronics, programming and problem solving</p>
            <p className="location">📍 Cork, Ireland</p>
          </div>
        </div>
      </header>
      
      <h2>About Me</h2>
      <div className="about-content">
        <p>
          I'm a 19 year old engineering student at UCC with a passion for electronics, microcontrollers, and motorsport. 
          My journey in technology began at an early age, where I attended my first CoderDojo session at 8 years old.
        </p>
        
        <h3>Background</h3>
        <p>
         I’ve started my Engineering studies at UCC after a successful Leaving Certificate, building on a strong foundation in electronics, programming, and problem-solving. 
         My experience spans both business and hardware projects, giving me a well-rounded perspective and the ability to tackle a diverse range of challenges.
        </p>
        
        <h3>Skills & Interests</h3>
        <ul>
          <li><strong>Electronics:</strong> Circuit design, microcontroller programming, sensor integration</li>
          <li><strong>Programming:</strong> Python, C++, JavaScript, and various other embedded systems</li>
          <li><strong>3D Design:</strong> Autodesk Fusion 360, 3D printing</li>
          <li><strong>Robotics:</strong> VEX Robotics, CanSat competitions, autonomous systems</li>
          <li><strong>Software Development:</strong> Web development, C++ library design, mobile app development</li>
        </ul>
        
        <h3>Goals</h3>
        <p>
          I'm excited to pursue engineering and continue developing and strengthening my skills. 
          I'm particularly interested in renewable energy systems, motorsport, and the intersection of electronics and software.
        </p>
      </div>
    </div>
  );
}