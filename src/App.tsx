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