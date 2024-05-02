import { User } from "@prisma/client";

type TestRequest = {
  owner: string;
  name: string;
  numberOfquestions: number;
  questions: Question[];
  courseName: string;
  courseSubject: string;
  prompt: string;
  documentUrls: string[];
};

type Test = {
  id: string;
  threadId: string;
  owner: string;
  testName: string;
  createdAt: Date | string;
  courseName: string;
  courseSubject: string;
  status: string;
  questions: Question[];
  responses: Response[];
}

type Question = {
  id: number;
  questionText: string;
  testId: string;
};

type Response = {
  id: number;
  studentId: string;
  student: Student;
  testId: string;
  test: Test;
  questionResponses: string[];
  responseGrades: number[];
  responseFeedbacks: string[];
}

type Student = {
  id: string;
  teacherId: string;
  teacher: User;
  studentId: string;
  class: string;
  name: string;
  email: string;
  testingStatus: string;
  responses: Response[];
}