const About = () => {
  return (
    <div className="section">
      <div className="container-custom">
        <h2 className="text-2xl font-bold mb-8 text-glow">&gt; about me</h2>
        <div className="p-6 bg-surface rounded-none border border-primary-dark space-y-6">
          <p className="text-primary-light">
            Hi, I'm Alex! I'm a software engineer passionate about building beautiful and functional web applications.
            I specialize in React, Next.js, and modern web technologies.
          </p>
          
          <p className="text-primary-light">
            Currently, I'm focused on creating performant and accessible web applications
            that provide great user experiences. I love working with modern technologies
            and am always eager to learn new things.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">&gt; skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-primary mb-2">Languages</h4>
                <ul className="text-primary-light space-y-1">
                  <li>JavaScript (ES6+)</li>
                  <li>TypeScript</li>
                  <li>Python</li>
                  <li>HTML/CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="text-primary mb-2">Frameworks</h4>
                <ul className="text-primary-light space-y-1">
                  <li>React</li>
                  <li>Next.js</li>
                  <li>Node.js</li>
                  <li>Express</li>
                </ul>
              </div>
              <div>
                <h4 className="text-primary mb-2">Tools</h4>
                <ul className="text-primary-light space-y-1">
                  <li>Git</li>
                  <li>Docker</li>
                  <li>AWS</li>
                  <li>GraphQL</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">&gt; experience</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-primary font-bold">Senior Software Engineer</h4>
                  <span className="text-primary-light">2023 - Present</span>
                </div>
                <p className="text-primary-light">
                  Leading development of scalable web applications using React and Next.js.
                  Implementing modern design systems and improving performance.
                </p>
              </div>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-primary font-bold">Software Engineer</h4>
                  <span className="text-primary-light">2020 - 2023</span>
                </div>
                <p className="text-primary-light">
                  Developed and maintained multiple client projects.
                  Focused on front-end development with React and TypeScript.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
