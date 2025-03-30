import { OutlineContent } from "@shared/schema";

/**
 * This is a helper function that you can use on the client side
 * to generate a sample outline purely for preview purposes
 * before submitting to the server.
 */
export function generatePreviewOutline(topic: string): OutlineContent {
  const title = topic;
  
  // Create a basic outline structure
  const sections = [
    {
      title: "I. Introduction",
      items: [
        "Define the topic and its importance",
        "Statistics related to the topic",
        "Overview of the benefits"
      ]
    },
    {
      title: "II. Understanding the Topic",
      items: [
        "Common challenges",
        "The psychology behind the topic",
        "Assessment: Identifying your style"
      ]
    },
    {
      title: "III. Main Points",
      items: [
        "First major point with evidence",
        "Second major point with examples",
        "Third major point with analysis"
      ]
    },
    {
      title: "IV. Practical Applications",
      items: [
        "How to apply the first concept",
        "Strategies for the second concept",
        "Tools and resources"
      ]
    },
    {
      title: "V. Case Studies",
      items: [
        "Example 1: Success story",
        "Example 2: Lessons learned",
        "Key takeaways from examples"
      ]
    },
    {
      title: "VI. Conclusion",
      items: [
        "Recap of main points",
        "Call to action",
        "Final thoughts and future outlook"
      ]
    }
  ];
  
  return { title, sections };
}
