# TestQuick Beta - Testing Platform and Toolkit

TestQuick is an AI-powered testing platform and generative toolkit designed for educators to create, administer, and grade exams with ease. It leverages artificial intelligence to generate unique and customizable test questions, provides auto-grading assistance, and offers an intuitive platform for managing tests and tracking student performance.

## Table of Contents

- [Features](#features)
- [Experiment Synopsis](#experiment-synopsis)
- [Data Analysis](#data-analysis)
  - [AI-Generated Question Accuracy Sentiment](#ai-generated-question-accuracy-sentiment)
  - [AI-Generated Grading & Feedback Accuracy Sentiment](#ai-generated-grading--feedback-accuracy-sentiment)
  - [AI-Generated "Hints" Feature Accuracy Sentiment](#ai-generated-hints-feature-accuracy-sentiment)
  - [Platform UI/UX Ratings](#platform-uiux-ratings)
- [Getting Started](#getting-started)
- [Future Implications](#future-implications)

## Features

- **Test Builder:** Build tests with the help of AI, customize questions, and adjust test length and difficulty.
- **Testing Portal:** Secure online test-taking environment with accessibility customizations and helper widgets.
- **Assisted Grading:** Auto-grade feature suggests scores and feedback for student responses, streamlining the grading process.
- **Admin Platform:** Intuitively manage exams, administer tests, and view performance metrics for exams and students.

## Experiment Synopsis

TestQuick was tested with 43 students in Laney College's CIS27 class. The experiment aimed to collect data on sentiment surrounding AI in the classroom, measure the effectiveness of AI models in generating test questions and grading student responses, and assess the usefulness of the TestQuick UI compared to a chat interface.

## Data Analysis

### AI-Generated Question Accuracy Sentiment
![AI-Generated Question Accuracy Sentiment](/public/Question_Accuracy_Ratings.png)
Average rating: 7.80/10, indicating generally accurate and relevant questions.

### AI-Generated Grading & Feedback Accuracy Sentiment
![AI-Generated Grading & Feedback Accuracy Sentiment](/public/Auto-Grader_Ratings.png)
Average rating: 7.74/10, showing varied opinions on auto-grading accuracy and AI feedback helpfulness.

### AI-Generated "Hints" Feature Accuracy Sentiment
![AI-Generated "Hints" Feature Accuracy Sentiment](/public/AI_Hints_Feature_Ratings.png)
Average rating: 7.60/10, suggesting generally positive sentiment toward the "hints" feature.

### Platform UI/UX Ratings
![Platform UI/UX Ratings](/public/Platform_UI_UX_Ratings.png)
Average rating: 8.16/10, demonstrating broadly positive opinions on the platform's appearance, ease of use, intuitiveness, professionalism, and accessibility.

## Getting Started

This project is built with [Next.js](https://nextjs.org/) and bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

1. Add the required API keys to the `.env` file.

2. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future Implications

TestQuick aims to expand into a full learning management system (LMS) and online classroom with an AI toolkit for teachers and an AI tutoring portal for students. The project will be open-sourced to promote transparency, collaboration, and further innovation from the community. Additionally, grant funding will be pursued to establish local GPU clusters and AI inference servers in Bay Area schools, enabling high-performance, low-latency AI assistance without reliance on cloud providers.

For more information about Next.js and deployment options, refer to the [Next.js Documentation](https://nextjs.org/docs).