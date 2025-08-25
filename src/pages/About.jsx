export default function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <div className="profile-section">
          <div className="profile-image">
            <img src="/assets/nathan.jpeg" alt="Nathan Manley" />
          </div>
          <div className="profile-info">
            <h1>Nathan Manley</h1>
            <h2>Aspiring Electrical Engineer • Passionate Innovator</h2>
            <p className="intro-text">Strong foundation in electronics, programming and problem solving</p>
            <p className="location">📍 Cork, Ireland</p>
          </div>
        </div>
      </header>
      
      <h2>About Me</h2>
      <div className="about-content">
        <p>
          I'm a 19 year old engineering student with a passion for electronics, microcontrollers, and motorsport. 
          My journey in technology began at an early age, where I attended my first CoderDojo session at 8 years old.
        </p>
        
        <h3>Background</h3>
        <p>
          I'm starting my journey at UCC this September, with a strong foundation in electronics, programming, and problem-solving. 
          My experience spans from business to hardware projects, giving me a well-rounded perspective on various challenges.
        </p>
        
        <h3>Skills & Interests</h3>
        <ul>
          <li><strong>Electronics:</strong> Circuit design, microcontroller programming, sensor integration</li>
          <li><strong>Programming:</strong> Python, C++, JavaScript, and various embedded systems</li>
          <li><strong>3D Design:</strong> Autodesk Fusion 360, 3D printing </li>
          <li><strong>Robotics:</strong> VEX Robotics, CanSat competitions, autonomous systems</li>
          <li><strong>Software Development:</strong> Web development, API design, mobile app development</li>
        </ul>
        
        <h3>Goals</h3>
        <p>
          I'm excited to pursue electrical engineering at university and continue developing my skills in both hardware and software. 
          I'm particularly interested in renewable energy systems, motorsport, and the intersection of electronics and software.
        </p>
      </div>
    </div>
  );
}