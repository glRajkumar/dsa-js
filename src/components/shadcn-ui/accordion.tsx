import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>.arrow]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="arrow text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

type accordionItemT = {
  value: string
  trigger: React.ReactNode
  content: React.ReactNode
  className?: string
  triggerCls?: string
  contentCls?: string
  disabled?: boolean
}

type accordionItemsT = accordionItemT[]

type accordionWrapperProps = {
  items: accordionItemsT
  itemCls?: string
  triggerCls?: string
  contentCls?: string
  type?: "single" | "multiple"
  collapsible?: boolean
} & Omit<React.ComponentProps<typeof AccordionPrimitive.Root>, "type" | "collapsible">

function AccordionWrapper({
  items,
  itemCls,
  triggerCls,
  contentCls,
  type = "single",
  ...props
}: accordionWrapperProps) {
  return (
    <Accordion type={type} {...(props as any)}>
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className={cn(itemCls, item.className)}
          disabled={item.disabled}
        >
          <AccordionTrigger className={cn("items-center justify-start gap-2 [&_.arrow]:ml-auto", triggerCls, item.triggerCls)}>
            {item.trigger}
          </AccordionTrigger>

          <AccordionContent className={cn(contentCls, item.contentCls)}>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionWrapper,
  type accordionItemT,
  type accordionItemsT,
}
