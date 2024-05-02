import { AccordionTrigger, AccordionContent, AccordionItem, Accordion } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <div className="w-full pb-6">
      <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
      <Accordion className="w-full mt-4" type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:underline-none">
            How can I be sure that the information generated by TestQuick is accurate?
          </AccordionTrigger>
          <AccordionContent>
            To ensure accuracy, the TestQuick generative toolkit cross-references user-uploaded course materials with a high performance and education specialized generative ai model.
            However, it is important for users to review the AI-generated information and use the service as an aid in the creation of in-depth and creative class materials, not the sole creator..
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="hover:underline-none">
            What is generative technology?
          </AccordionTrigger>
          <AccordionContent>
            Generative technologies like TestQuick have the opportunity to greatly enhance human learning and capabilites.
            They serve as interactive tools that provide explanations, generate creative ideas, and facilitate language learning.
            We belive that our generative service and platform will help teachers to create more engaging and effective educational materials.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
