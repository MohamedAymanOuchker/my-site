import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scene } from './components/Scene';
import { ProjectCard } from './components/ProjectCard';
import { Github, Linkedin, Mail, Terminal, Database, Cpu, Brain, Notebook as Robot, Microwave as Microchip } from 'lucide-react';
import emailjs from 'emailjs-com';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!email || !message) {
      alert('Please fill in both fields!');
      return;
    }

    setIsSending(true);

    try {
      await emailjs.send(
        'service_gjveznh', // Replace with your EmailJS Service ID
        'template_ug7i3xd', // Replace with your EmailJS Template ID
        { email, message }, // The variables to be sent to the template
        'm82tfYbr9tSP5AwI8' // Replace with your EmailJS Public Key
      );
      alert('Message sent successfully!');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const skills = [
    { icon: <Terminal className="w-8 h-8" />, name: 'Software Development', details: 'Python, C++, ROS' },
    { icon: <Brain className="w-8 h-8" />, name: 'Machine Learning', details: 'TensorFlow, PyTorch' },
    { icon: <Robot className="w-8 h-8" />, name: 'Robotics', details: 'ROS, Motion Planning' },
    { icon: <Microchip className="w-8 h-8" />, name: 'Embedded Systems', details: 'Raspberry Pi, Arduino' },
    { icon: <Database className="w-8 h-8" />, name: 'Computer Vision', details: 'OpenCV, YOLO' },
    { icon: <Cpu className="w-8 h-8" />, name: 'Hardware Design', details: 'PCB, 3D Printing' },
  ];

  const projects = [
    {
      title: 'AgriBot',
      description: 'Autonomous agricultural robot utilizing computer vision and deep learning for precise crop monitoring and harvesting. Implemented control system with custom path planning algorithms.',
      image: 'https://www.raspberrypi.com/app/uploads/2024/01/Screenshot-2024-01-25-at-13.45.16.png',
      technologies: ['ROS', 'Python', 'Computer Vision', 'Deep Learning'],
    },
    {
      title: 'AI-Powered Face Detection',
      description: 'Real-time face detection and emotion recognition system using custom-trained neural networks. Achieves 98% accuracy with optimized inference for edge devices.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Edge AI'],
    },
    {
      title: 'Robotic Control System',
      description: 'Advanced mobile application for precise robot control using custom protocols. Features real-time telemetry, autonomous navigation, and gesture-based control.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800',
      technologies: ['ROS', 'Android', 'Raspberry Pi', 'SLAM'],
    },
    {
      title: 'Path Planning Game',
      description: 'An interactive mobile game that visualizes pathfinding algorithms like A*, Dijkstra, and BFS in an engaging way. Players solve mazes and navigate obstacles while learning about AI-driven navigation strategies.',
      image: 'https://www.vecnarobotics.com/wp-content/uploads/2021/08/AMR-Path-Planning-A-Smarter-%E2%80%A8More-Efficient-Navigation-Method@2x.png',
      technologies: ['Java', 'Xml', 'AI Pathfinding', 'Mobile Game Development'],
    },
    {
      title: 'Fuel Level Calculation Unit (FLCU)',
      description: 'Development of a Fuel Level Calculation Unit (FLCU) for an aircraft system, ensuring precise fuel measurement and monitoring. Implemented using model-based design, system simulations, and validation through the V-cycle approach.',
      image: 'https://circuitdigest.com/sites/default/files/projectimage_tut/Getting-Started-with-Simulink-in-MATLAB.png',
      technologies: ['Matlab', 'Simulink', 'Model-Based Design', 'V-Cycle'],
    },    
    {
      title: 'Color Tracking Robot',
      description: 'A Raspberry Pi-powered autonomous robot that uses OpenCV for real-time color detection and object tracking. The robot identifies and follows colored objects, making it ideal for interactive robotics applications.',
      image: 'https://indystry.cc/wp-content/uploads/2020/08/P1480056-1024x768.jpg',
      technologies: ['Raspberry Pi', 'OpenCV', 'Python', 'Computer Vision'],
    },    
    {
      title: '4DOF Mechanical Robotic Arm Car',
      description: 'A four-degree-of-freedom (4DOF) robotic arm mounted on a mobile car platform, enabling precise object manipulation and autonomous movement. Developed using C++ for real-time control and motion planning.',
      image: 'https://diogenistore.gr/p/27889/p_keyestudio-4dof-mechanical-robot-arm-car-kit-ks0520-gia-arduino-ks0520_1.jpg',
      technologies: ['C++', 'Robotics', 'Embedded Systems', 'Motion Control'],
    },
    {
      title: 'Smart House System',
      description: 'An Arduino-based smart home automation system that controls lighting, security, and appliances remotely. Features include motion detection, voice commands, and IoT integration for seamless connectivity.',
      image: 'data:image/jpeg;base64,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',
      technologies: ['Arduino', 'IoT', 'Sensors', 'Home Automation'],
    },        
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900">
          <Scene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Ouchker Med Ayman
              </h1>
              <h2 className="text-3xl text-blue-300 mb-8">Robotics & AI Engineer</h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Crafting intelligent robotic systems that push the boundaries of automation and artificial intelligence
            </motion.p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-blue-400 rounded-full mt-2" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Technical Expertise</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Specialized in cutting-edge robotics and AI technologies
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                className="p-8 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500 transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 text-blue-400 p-3 rounded-lg bg-blue-900/20">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                  <p className="text-gray-400">{skill.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Innovative solutions pushing the boundaries of robotics and AI
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Interested in collaboration? Let's discuss your next robotics or AI project
            </p>
          </motion.div>
          <div className="flex justify-center space-x-8 mb-12">
            {[
              { icon: <Github className="w-8 h-8" />, href: 'https://github.com/MohamedAymanOuchker', label: 'GitHub' },
              { icon: <Linkedin className="w-8 h-8" />, href: 'https://www.linkedin.com/in/mohamed-ayman-ouchker/', label: 'LinkedIn' },
              { icon: <Mail className="w-8 h-8" />, href: 'mailto:ayman.ouchker@outlook.com', label: 'Email' },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto space-y-4"
          >
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all text-white"
            />
            <textarea
              placeholder="Your message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all text-white"
            />
            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-4 px-8 rounded-lg ${
                isSending
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              } text-white font-semibold transition-all transform hover:scale-105`}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}

export default App;