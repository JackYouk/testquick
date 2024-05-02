import { Test } from "@/app/types/test";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { jsPDF } from 'jspdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [month, day, year].join('/');
}

export const calculateAverage = (nums: number[]): number => {
  if (nums.length === 0) return 0; // Avoid division by zero
  let sum = nums.reduce((a, b) => a + b, 0);
  const avg = (sum / nums.length) * 10
  return Number(avg.toFixed(1));
}


export const handleDownloadAsPdf = async (test: Test) => {
  if (!test) return
  const doc = new jsPDF();
  const logoURL = '/testquick.png';
  const logo = await fetch(logoURL).then(response => response.blob()).then(blob => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));
  const img = new Image();
  img.src = logo;
  await new Promise((resolve) => img.onload = resolve); // Ensure image is loaded
  const scaleFactor = 40 / img.width;
  const scaledHeight = img.height * scaleFactor;
  const pageWidth = 210;  // Default width for A4 paper in jsPDF
  const xCentered = (pageWidth / 2) - (40 / 2);  // Subtract half the logo's width to center
  doc.addImage(logo, 'PNG', xCentered, 10, 40, scaledHeight);
  doc.setFontSize(10);
  let yPosition = 20 + scaledHeight;
  doc.setFont("helvetica", "bold");
  doc.text(test.testName, 10, yPosition);
  doc.setFont("helvetica", "normal");
  yPosition += 10;
  test.questions.forEach((question, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${question.questionText}`, 180);
    // Check if we have enough space on the current page for the current question
    if (yPosition + (lines.length * 22) > 280) {  // Assuming A4 size
      doc.addPage();
      yPosition = 20;  // Reset position for the new page
    }
    doc.text(lines, 10, yPosition);
    yPosition += (lines.length * 25);
  });
  doc.save(`${test.testName}.pdf`);
}


export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};