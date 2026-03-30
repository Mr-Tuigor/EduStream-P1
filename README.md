# EduStream
    Author: Shaharyar Ansari
    Affiliation: Suryodaya College of Engineering and Technology
    Date: ....

# Absatract
    Context: Engineering students face vast curricula and time constraints.

    Problem: Traditional platforms offer content but lack personalized feedback or automated assessment for long-form answers.
    
    Solution: An AI-integrated MERN stack platform that provides video curation, AI-driven text summarization, and an automated testing suite.
    
    Impact: This system reduces the cognitive load on students by providing immediate feedback and condensed study materials.

# Introduction

    Background: The current state of engineering education in India, referencing the need for better digital tools for technical subjects.
    
    Objective: To transition from simple video curation to an intelligent learning assistant.
    
    Innovation: Highlighting the use of Large Language Models (LLMs) to evaluate engineering-specific long answers, which is traditionally a manual task.

# Litreture Review
    Current Platforms: Discuss existing systems like NPTEL or Coursera and their lack of automated subjective evaluation.

    AI in EdTech: Review recent research on using Natural Language Processing (NLP) for automated grading and text summarization.
    
    Gap Analysis: Most platforms focus on MCQs; few handle the complex diagrams and long-form reasoning required in engineering.

# Methodology
    Architecture: The MERN (MongoDB, Express, React, Node.js) stack serves as the robust foundation.

    AI Integration: Use of APIs (like Gemini or OpenAI) for the intelligence layer.
    
    Data Flow: Describe how a student selects a subject (e.g., Electronics or Computer Science), watches a video, and then triggers AI modules for post-learning        activities.

# Implementation
    Summarization Engine: Converts long video transcripts or documents into concise bullet points for quick revision.
    
    MCQ Generator: AI analyzes the content to create relevant multiple-choice questions dynamically.
    
    Subjective Evaluator: This module takes a student's long-form answer and compares it against "Gold Standard" technical answers, providing a score and specific      feedback on missing keywords or conceptual errors.
    
    Feedback Loop: Using the voting logic we previously built to rank the most helpful AI-generated summaries.

# Result and Discussion
    Performance Metrics: Accuracy of AI summarization compared to human summaries.

    User Feedback: (Even if simulated for the paper) Discuss how engineering students saved time during exam prep.
    
    Scalability: How the MERN stack handles multiple concurrent AI requests.

# Limitation
    AI Hallucinations: AI might occasionally generate incorrect technical formulas.

    Context Length: Difficulty in summarizing extremely long technical lectures (1 hour+).
    
    Subjectivity: AI may struggle with highly creative or non-standard engineering solutions that are still technically correct.

# Future Scope
    Multi-modal AI: Adding the ability for the AI to understand and grade hand-drawn circuit diagrams or flowcharts.

    Personalized Learning Paths: AI suggesting specific videos or summaries based on the student's previous test performance.
    
    Voice Integration: Allowing students to "talk" to their study materials using Gemini Live-style interactions.

# Conclusion
    Summary: The project successfully bridges the gap between passive video watching and active, AI-assisted learning.

    Final Thought: By focusing on the specific needs of engineering students, this platform provides a localized and intelligent solution for technical education.

# References
    [1] Author, "Paper Title," Journal/Conference, Year.
    [2] Author, "Another Paper," Year.
    [3] text links
