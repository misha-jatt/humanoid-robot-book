import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className={styles.heroTitle}>
              Physical AI &<br />Humanoid Robotics
            </Heading>
            <p className={styles.heroSubtitle}>
              Master the technologies powering the next generation of intelligent robots.
              From ROS 2 fundamentals to Vision-Language-Action models.
            </p>
            <div className={styles.buttons}>
              <Link
                className={clsx('button button--primary button--lg', styles.primaryButton)}
                to="/docs/">
                Start Learning
              </Link>
              <Link
                className={clsx('button button--outline button--lg', styles.secondaryButton)}
                to="/docs/module1-ros2">
                Explore Modules
              </Link>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4</span>
                <span className={styles.statLabel}>Modules</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>15+</span>
                <span className={styles.statLabel}>Chapters</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>AI</span>
                <span className={styles.statLabel}>Chatbot</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.robotIcon}>🤖</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ModuleCards(): ReactNode {
  const modules = [
    {
      number: '01',
      title: 'ROS 2 Fundamentals',
      description: 'Learn the Robot Operating System 2 - nodes, topics, services, and actions.',
      link: '/docs/module1-ros2',
      color: '#2196F3',
    },
    {
      number: '02',
      title: 'Digital Twin',
      description: 'Build and test robots in photorealistic simulation environments.',
      link: '/docs/module-02-digital-twin',
      color: '#4CAF50',
    },
    {
      number: '03',
      title: 'AI-Robot Brain',
      description: 'Master NVIDIA Isaac for perception, training, and navigation.',
      link: '/docs/modules/module-3-ai-robot-brain/overview',
      color: '#FF9800',
    },
    {
      number: '04',
      title: 'Vision-Language-Action',
      description: 'Connect natural language to robot actions with VLA models.',
      link: '/docs/modules/module-4-vla',
      color: '#9C27B0',
    },
  ];

  return (
    <section className={styles.modulesSection}>
      <div className="container">
        <div className={styles.modulesSectionHeader}>
          <Heading as="h2">Course Modules</Heading>
          <p>A structured learning path from fundamentals to cutting-edge AI</p>
        </div>
        <div className={styles.modulesGrid}>
          {modules.map((module) => (
            <Link key={module.number} to={module.link} className={styles.moduleCard}>
              <div className={styles.moduleNumber} style={{backgroundColor: module.color}}>
                {module.number}
              </div>
              <div className={styles.moduleContent}>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
              <div className={styles.moduleArrow}>→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction(): ReactNode {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2">Ready to Build the Future?</Heading>
          <p>
            Join the robotics revolution. Learn the same technologies used by
            leading companies like Fourier Intelligence, Agility Robotics, and NVIDIA.
          </p>
          <Link
            className={clsx('button button--primary button--lg', styles.ctaButton)}
            to="/docs/">
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Learn Humanoid Robotics"
      description="A comprehensive textbook on Physical AI and Humanoid Robotics covering ROS 2, Digital Twins, NVIDIA Isaac, and Vision-Language-Action models">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <ModuleCards />
        <CallToAction />
      </main>
    </Layout>
  );
}
