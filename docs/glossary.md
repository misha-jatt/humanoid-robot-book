---
id: glossary
title: "Glossary"
sidebar_label: "Glossary"
sidebar_position: 100
description: "Definitions of key terms used throughout the Physical AI & Humanoid Robotics textbook"
keywords: [glossary, definitions, terminology, ros2, robotics, ai, vla, isaac]
---

# Glossary

This glossary defines key terms used throughout the textbook. Terms are listed alphabetically with simple definitions, examples, and references to where they're first introduced.

---

## A

### Action
**Definition**: A pattern for long-running, goal-oriented tasks with feedback. Actions allow robots to do complex jobs that take time and report progress along the way.

**Example**: When a humanoid robot receives a command to "walk forward 5 meters," it uses an action. The robot reports progress ("1 meter done... 2 meters done...") and can be stopped if needed.

**First Introduced**: Module 1, Chapter 3

### Automatic Speech Recognition (ASR)
**Definition**: Technology that converts spoken words into text. ASR systems analyze audio waveforms to transcribe human speech.

**Example**: OpenAI's Whisper is an ASR system that converts your voice command "bring me the red ball" into text that robots can process.

**First Introduced**: Module 4

---

## B

### Bipedal Locomotion
**Definition**: Two-legged walking, as performed by humans and humanoid robots. More challenging than wheeled movement because it requires constant balance adjustments.

**Example**: A humanoid robot walking across uneven terrain must constantly adjust its balance with each step, unlike a wheeled robot that remains stable.

**First Introduced**: Module 3

---

## C

### Cascading Pipeline
**Definition**: A multi-stage processing chain where each component passes output to the next, like an assembly line.

**Example**: In voice-to-action systems, audio goes through speech recognition, then language understanding, then task planning, then motion planning—each stage feeding into the next.

**First Introduced**: Module 4

### Client Library
**Definition**: A software library that provides an interface for programs written in a specific language to interact with a system. Client libraries translate function calls in one language to commands the system understands.

**Example**: rclpy is a client library that allows Python programs to interact with ROS 2. It translates Python function calls into ROS 2 operations like publishing messages or subscribing to topics.

**First Introduced**: Module 1, Chapter 4

### Cognitive Planning
**Definition**: High-level reasoning that determines what actions to take to achieve a goal. It involves breaking down complex tasks into manageable steps.

**Example**: When told "clean the room," cognitive planning breaks this into: scan environment, identify items, plan cleaning sequence, execute pick-and-place for each item.

**First Introduced**: Module 4

---

## D

### Digital Twin
**Definition**: A virtual replica of a physical robot or environment used for simulation, testing, and training.

**Example**: Before deploying a humanoid robot in a warehouse, engineers create a digital twin of both the robot and warehouse to test navigation algorithms safely.

**First Introduced**: Module 2

---

## E

### Embodied AI
**Definition**: Artificial intelligence that interacts with the physical world through a robot body, rather than existing only in computers.

**Example**: A humanoid robot that learns to fold laundry by physically practicing demonstrates embodied AI—it must understand physics, objects, and actions in the real world.

**First Introduced**: Module 4

### End-to-End Learning
**Definition**: A machine learning approach where a single model handles the entire process from raw inputs to final outputs, without separate stages.

**Example**: Modern VLA models process voice and camera input directly to robot actions, rather than passing through separate speech recognition and planning stages.

**First Introduced**: Module 4

---

## F

### Fault Tolerance
**Definition**: The ability of a system to continue operating even when parts of it fail. Fault-tolerant systems isolate failures to prevent them from cascading.

**Example**: In a ROS 2 humanoid robot, if the speech recognition node crashes, the robot can still walk and maintain balance because those functions run in separate nodes.

**First Introduced**: Module 1, Chapter 2

### Footstep Planning
**Definition**: The process of calculating where each foot should be placed during bipedal walking, considering balance, obstacles, and terrain.

**Example**: A humanoid robot navigating around furniture must plan each footstep to avoid collisions while maintaining balance.

**First Introduced**: Module 3

---

## G

### Generalist Policy
**Definition**: A robot control system that can perform many different tasks, rather than being specialized for just one action.

**Example**: A robot with a generalist policy can pick up various objects, open doors, and navigate obstacles using the same underlying AI model.

**First Introduced**: Module 4

### GPU (Graphics Processing Unit)
**Definition**: A processor designed for parallel computing, originally for graphics but now widely used for AI and robotics computations.

**Example**: Isaac ROS uses GPUs to process camera images at 250 frames per second—much faster than CPUs that process images sequentially.

**First Introduced**: Module 3

### Grounding Problem
**Definition**: The challenge of connecting abstract language (like "that red thing") to specific physical objects a robot can perceive and interact with.

**Example**: When you say "grab the cup," the robot must determine which object in its camera view corresponds to "cup"—this is the grounding problem.

**First Introduced**: Module 4

---

## H

### Hallucination
**Definition**: When AI systems generate plausible-sounding but incorrect or impossible outputs.

**Example**: An LLM might plan for a robot to "fly to the ceiling" even though the robot has no flying capability—this is a hallucination.

**First Introduced**: Module 4

---

## I

### Isaac ROS
**Definition**: NVIDIA's collection of GPU-accelerated ROS 2 packages for robot perception, including visual SLAM and object detection.

**Example**: Isaac ROS Visual SLAM processes camera images at 250 FPS, enabling robots to track their position in real-time.

**First Introduced**: Module 3

### Isaac Sim
**Definition**: NVIDIA's photorealistic robot simulation platform built on RTX technology, used for training and testing robots in virtual environments.

**Example**: Engineers can train a humanoid robot to walk in Isaac Sim, generating millions of practice runs without risking physical hardware.

**First Introduced**: Module 3

---

## J

### Joint
**Definition**: A connection between two links (body parts) that defines how they can move relative to each other.

**Example**: A humanoid robot's elbow is a revolute joint that allows the forearm to rotate relative to the upper arm, like a hinge.

**First Introduced**: Module 1, Chapter 5

---

## L

### Large Language Model (LLM)
**Definition**: AI systems trained on massive text data that can understand and generate natural language. LLMs form the foundation of conversational AI and robot language understanding.

**Example**: GPT-4 and Claude are LLMs that can understand complex instructions like "clean the room starting from the corner" and break them into steps.

**First Introduced**: Module 4

### Latency
**Definition**: The time delay between an input (like a voice command) and the corresponding output (robot action).

**Example**: Traditional voice-to-action pipelines have 1-3 seconds of latency; modern end-to-end VLA systems reduce this to 100-500ms.

**First Introduced**: Module 4

### Link
**Definition**: A rigid body part of a robot that doesn't bend or flex.

**Example**: In a humanoid robot's arm, the upper arm and forearm are separate links. They're solid pieces connected by joints.

**First Introduced**: Module 1, Chapter 5

---

## M

### Middleware
**Definition**: Software that sits between different programs and helps them communicate with each other.

**Example**: ROS 2 is middleware. It helps the camera program send images to the vision program without those programs needing to know the details of how to connect.

**First Introduced**: Module 1, Chapter 1

### Modularity
**Definition**: The practice of designing systems as independent, interchangeable components where each part has one clear responsibility.

**Example**: In ROS 2, each node is modular - the camera node only handles capturing images, the vision node only processes images, and the control node only manages motors. This makes the system easier to understand and maintain.

**First Introduced**: Module 1, Chapter 2

---

## N

### Nav2 (Navigation2)
**Definition**: The ROS 2 navigation stack that handles path planning and obstacle avoidance for mobile robots.

**Example**: Nav2 plans both the overall route through a building and moment-by-moment steering around obstacles.

**First Introduced**: Module 3

### Node
**Definition**: An independent program that performs one specific task in a robot system. Each node runs separately and communicates with other nodes through ROS 2.

**Example**: A camera node captures images. A vision node processes those images to detect objects. Each does one job well.

**First Introduced**: Module 1, Chapter 2

---

## P

### Perception
**Definition**: A robot's ability to sense and understand its environment through sensors like cameras, LiDAR, and IMUs.

**Example**: Perception allows a humanoid robot to detect a chair in its path and understand that it needs to walk around it.

**First Introduced**: Module 3

### Process
**Definition**: An independent program running on a computer's operating system. Each process has its own memory space and cannot directly access another process's data.

**Example**: Each ROS 2 node runs as a separate process. The camera node and vision node are different processes that communicate through ROS 2 messages rather than sharing memory.

**First Introduced**: Module 1, Chapter 2

### Publisher
**Definition**: A node that sends data to a topic. Publishers put information out for any interested node to receive.

**Example**: A balance sensor node publishes tilt measurements to a "balance_data" topic 100 times per second.

**First Introduced**: Module 1, Chapter 3

---

## Q

### Quality of Service (QoS)
**Definition**: Settings that control how reliably and quickly messages are delivered between nodes. QoS lets you choose between guaranteed delivery (slower) and best-effort delivery (faster).

**Example**: A humanoid's balance sensor might use best-effort QoS because new data arrives constantly and missing one measurement isn't critical.

**First Introduced**: Module 1, Chapter 3

---

## R

### RAG (Retrieval-Augmented Generation)
**Definition**: An AI technique that combines information retrieval with text generation, allowing AI to answer questions using specific documents or knowledge bases.

**Example**: This textbook's chatbot uses RAG to find relevant passages and generate accurate answers about robotics concepts.

**First Introduced**: Architecture Documentation

### rclpy
**Definition**: The Python client library for creating ROS 2 nodes and interacting with the ROS 2 ecosystem. It's the bridge between Python AI code and robot systems.

**Example**: A PyTorch vision model uses rclpy to publish object detections that the robot's navigation system can read.

**First Introduced**: Module 1, Chapter 4

### ROS 2 (Robot Operating System 2)
**Definition**: Middleware that helps different robot programs communicate with each other. ROS 2 is not an operating system like Windows or Linux - it runs on top of an OS.

**Example**: ROS 2 lets a humanoid robot's camera send images to its vision system, which sends detections to its navigation system, which sends commands to its motors - all coordinated smoothly.

**First Introduced**: Module 1, Chapter 1

---

## S

### Service
**Definition**: A request-response communication pattern for queries. One node asks a question, another node responds.

**Example**: A navigation system might ask a battery monitor node "What's your battery level?" and receive a response like "75%".

**First Introduced**: Module 1, Chapter 3

### Sim-to-Real Transfer
**Definition**: The process of taking robot behaviors learned in simulation and deploying them on physical robots with minimal adjustment.

**Example**: A walking policy trained in Isaac Sim can be transferred to a physical humanoid robot and work immediately without retraining.

**First Introduced**: Module 3

### Subscriber
**Definition**: A node that receives data from a topic. Subscribers listen for information that publishers send.

**Example**: A leg control node subscribes to the "balance_data" topic to receive tilt measurements and adjust the humanoid's posture.

**First Introduced**: Module 1, Chapter 3

### Synthetic Data
**Definition**: Artificially generated training examples created in simulation, used to train AI models without collecting real-world data.

**Example**: Isaac Sim generates millions of images of robots in various poses—synthetic data that trains perception models faster than collecting real photos.

**First Introduced**: Module 3

---

## T

### Topic
**Definition**: A named channel for streaming data between nodes. Topics use a publish-subscribe pattern where publishers send data and subscribers receive it.

**Example**: A "camera_images" topic carries image data from a camera node to any vision processing nodes that subscribe to it.

**First Introduced**: Module 1, Chapter 3

---

## U

### URDF (Unified Robot Description Format)
**Definition**: An XML format that describes a robot's physical structure - its links, joints, sensors, and how they're connected.

**Example**: A humanoid robot's URDF file describes its body: torso (link), shoulder joint, upper arm (link), elbow joint, forearm (link), and so on.

**First Introduced**: Module 1, Chapter 5

---

## V

### VLA (Vision-Language-Action)
**Definition**: Neural networks that connect what robots see (vision), what humans say (language), and what robots do (action) into unified models.

**Example**: A VLA model receives a camera image and the command "pick up the apple," then outputs the motor commands to execute the grasp.

**First Introduced**: Module 4

### VSLAM (Visual Simultaneous Localization and Mapping)
**Definition**: An algorithm that simultaneously figures out where a robot is and builds a map of its surroundings using only camera images.

**Example**: As a humanoid robot walks through a building, VSLAM tracks its position while creating a map of hallways and rooms—all from camera data.

**First Introduced**: Module 3

---

## Z

### Zero-Shot Deployment
**Definition**: Deploying AI models that work immediately on new tasks without additional training or fine-tuning.

**Example**: A policy trained entirely in Isaac Sim working immediately on a physical robot without any real-world practice is zero-shot deployment.

**First Introduced**: Module 3

---

*This glossary covers key terms from all four modules. Terms are cross-referenced to help you navigate the textbook.*
