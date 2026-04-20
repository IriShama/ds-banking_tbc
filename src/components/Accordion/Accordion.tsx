import { useState } from 'react'
import './Accordion.css'

interface AccordionItemProps {
  title: string
  description?: string
  showDescription?: boolean
  showDivider?: boolean
  defaultExpanded?: boolean
}

interface AccordionProps {
  items: AccordionItemProps[]
}

function AccordionItem({
  title,
  description,
  showDescription = true,
  showDivider = true,
  defaultExpanded = false,
}: AccordionItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={`accordion-item ${expanded ? 'accordion-item--open' : ''} ${showDivider ? 'accordion-item--divider' : ''}`}>
      <button
        className="accordion-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="accordion-title">{title}</span>
        <span className={`accordion-icon ${expanded ? 'accordion-icon--open' : ''}`}>
          ›
        </span>
      </button>

      {expanded && showDescription && description && (
        <div className="accordion-body">{description}</div>
      )}
    </div>
  )
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <AccordionItem key={index} {...item} />
      ))}
    </div>
  )
}