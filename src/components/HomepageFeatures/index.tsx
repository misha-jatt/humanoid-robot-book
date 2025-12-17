import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'ROS 2 Foundations',
    icon: '🤖',
    description: (
      <>
        Master the Robot Operating System 2 - the industry-standard middleware
        powering humanoid robots. Learn nodes, topics, services, and actions
        through hands-on examples.
      </>
    ),
  },
  {
    title: 'Digital Twin Simulation',
    icon: '🌐',
    description: (
      <>
        Build and test robots in photorealistic virtual environments before
        deploying to hardware. Leverage NVIDIA Isaac Sim for safe, cost-effective
        robot development.
      </>
    ),
  },
  {
    title: 'AI-Powered Perception',
    icon: '👁️',
    description: (
      <>
        Explore GPU-accelerated perception with Isaac ROS and Nav2. Enable your
        robot to see, understand, and navigate complex environments in real-time.
      </>
    ),
  },
  {
    title: 'Vision-Language-Action',
    icon: '🧠',
    description: (
      <>
        Discover how LLMs transform robotics. Build robots that understand natural
        language commands and translate them into physical actions using VLA models.
      </>
    ),
  },
  {
    title: 'Interactive AI Chatbot',
    icon: '💬',
    description: (
      <>
        Get instant answers with our built-in RAG-powered chatbot. Ask questions
        about any concept and receive contextual explanations from the textbook content.
      </>
    ),
  },
  {
    title: 'Industry-Ready Skills',
    icon: '🚀',
    description: (
      <>
        Learn the same tools used by Fourier Intelligence, Agility Robotics, and
        other leading companies building the humanoid robots of tomorrow.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <div className="padding-horiz--md">
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">What You'll Learn</Heading>
          <p>A complete curriculum for building intelligent humanoid robots</p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
